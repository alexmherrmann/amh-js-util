import { test } from "node:test"
import { equal } from "node:assert"
import { debounced } from "../src/debounce.mjs"

await test("debounce basic", async (t) => {
    let tests = []

    tests.push(
        t.test("should debounce a function", async (t) => {
            let counter = 0
            const dafunc = debounced(() => counter++, 100)

            for (let i = 0; i < 10; i++) {
                dafunc()
            }

            await new Promise(
                (r, j) => setTimeout(() => {
                    equal(counter, 1)
                    equal(dafunc.pending(), false)
                    r(true)
                }, 150)
            )
        })
    )

    tests.push(
        t.test("Can be cancelled", async (t) => {
            let counter = 0
            const dafunc = debounced(() => counter++, 100)

            for (let i = 0; i < 10; i++) {
                dafunc()
            }

            dafunc.cancel()

            await new Promise(
                (r, j) => setTimeout(() => {
                    equal(counter, 0)
                    equal(dafunc.pending(), false)
                    r(true)
                }, 150)
            )
        })
    )

    tests.push(
        t.test("Can be flushed", async (t) => {
            let counter = 0
            const dafunc = debounced(() => counter++, 100)

            for (let i = 0; i < 10; i++) {
                dafunc()
            }

            dafunc.flush()
            equal(counter, 1)
            equal(dafunc.pending(), false)
        })
    )

    return await Promise.all(tests)
})