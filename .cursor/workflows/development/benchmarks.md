# Create Benchmarks for a Function or Module

**Your task: Generate micro-benchmark tests to measure the performance of a specific function, class, or file.**

Follow these steps:

1. **Ensure Benchmark Directory:** If it doesn't already exist, create a top-level `benchmarks/` directory.
2. **Create Benchmark File:** Inside `benchmarks/`, create a file named after the target, using the `.bench.ts` extension (or `.js` if the project isn't using TypeScript).
3. **Use `tinybench`:** Install the `tinybench` library if not already present and import it in your benchmark file.
4. **Define Benchmark Cases:**
   - Import the target function, class, or module.
   - Set up one or more benchmark tasks with representative inputs.
   - Run the benchmarks and log results in ops/sec.
5. **Add Package Script:** Add a `"benchmark"` script to `package.json` that runs the benchmark file with `pnpm benchmark`.

**REMEMBER: Benchmarks should live only in the `benchmarks/` directory and remain deterministic to provide meaningful performance measurements.**
