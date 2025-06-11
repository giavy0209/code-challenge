/**
 * Complexity: O(n)
 *
 * @format
 */

export function sum_to_n_a(n: number): number {
  return Array.from({ length: n }, (_, i) => i + 1).reduce((sum, num) => sum + num, 0)
}

/**
 * Complexity: O(1)
 */
export function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2
}

/**
 * Complexity: O(n)
 */
export function sum_to_n_c(n: number): number {
  if (n <= 1) return n
  return n + sum_to_n_c(n - 1)
}

console.log(sum_to_n_a(5))
console.log(sum_to_n_b(5))
console.log(sum_to_n_c(5))
