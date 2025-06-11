function sum_to_n_a(n) {
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += i
  }
  return sum
}

function sum_to_n_b(n) {
  return (n * (n + 1)) / 2
}

function sum_to_n_c(n) {
  if (n <= 1) return n
  return n + sum_to_n_c(n - 1)
}

console.log(sum_to_n_a(5),'sum_to_n_a','n = 5')
console.log(sum_to_n_b(6),'sum_to_n_b','n = 6')
console.log(sum_to_n_c(7),'sum_to_n_c','n = 7')