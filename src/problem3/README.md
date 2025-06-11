<!-- @format -->

# Messy React

## 1 Using useMemo with Unnecessary Dependencies

- **Problem**: The useMemo for sortedBalances has a dependency array of [balances, prices]. However, the logic inside this hook (filtering and sorting) only uses balances. Including prices in the dependency is unnecessary and harmful to performance. Every time prices change (which could be frequently), the entire expensive filtering and sorting process on the balances array will be re-executed, even though the sorted result does not depend on prices at all.

```typescript
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain)
      if (lhsPriority > -99) {
        if (balance.amount <= 0) {
          return true
        }
      }
      return false
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain)
      const rightPriority = getPriority(rhs.blockchain)
      if (leftPriority > rightPriority) {
        return -1
      } else if (rightPriority > leftPriority) {
        return 1
      }
    })
}, [balances, prices])
```

- **Solution**: Remove prices from the useMemo dependency array to ensure the sorting logic only re-runs when balances actually changes.

## 2 Multiple Iterations and Unnecessary Intermediate Arrays

- **Problem**: The computational logic is split into multiple, separate loops:
  balances.filter().sort() to create sortedBalances.
  sortedBalances.map() to create formattedBalances (this array is subsequently not used, which is a potential bug).
  sortedBalances.map() again to create rows (the JSX components). This process creates intermediate arrays (sortedBalances, formattedBalances) and iterates over the list multiple times, which is inefficient for large datasets.
- **Solution:** Combine these operations. You can filter, sort, and then map directly to JSX components in a single method chain. Calculations for values like usdValue and formattedAmount should be performed in the final loop (when creating rows).

## 3. Flawed and Inefficient Filtering Logic

- **Problem**: The logic inside the filter function is buggy and confusing:

  - if (lhsPriority > -99): The variable lhsPriority is not defined in this scope. This is a critical bug. It should have been balancePriority.

  - if (balance.amount <= 0) { return true; }: This logic keeps wallets that have a zero or negative balance, which is typically not the desired behavior. Users usually want to hide these wallets.

- **Solution**: Correct the logic to be clear and match the intended purpose: filter out wallets with non-positive balances and those with an invalid priority (-99). The correct logic should be balance.amount > 0 && getPriority(balance.blockchain) > -99.

## 4. Using Index as a key for a List

- **Problem**: Using key={index} in a dynamically sorted list is an anti-pattern. React uses the key prop to uniquely identify elements, which helps optimize re-renders. When the list is re-sorted, the indices no longer represent the same data item. This can lead to incorrect rendering, loss of child component state, and degraded performance.
- **Solution**: Always use a unique and stable identifier from the data itself for the key. In this case, balance.currency is a good candidate, assuming each currency is unique within the list.

## 5. Unnecessary Function and Object Declarations on Every Render

- **Problem**: The getPriority function is redefined every time the WalletPage component renders. A static data structure, like a lookup object, would be more readable and performant.
- **Solution**: Convert the getPriority logic into a const object defined outside the component.

## 6. Unnecessary Interface Prop

- **Problem**: `interface Props extends BoxProps {}` without any additional property
- **Solution**: Use `BoxProps` directly
