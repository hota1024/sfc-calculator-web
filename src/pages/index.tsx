import { Container } from '@/components/Container'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

type FormulaOperatorItem = '%' | '+' | '-' | '*' | '/'
type FormulaItem = number | FormulaOperatorItem | '.'

const isOperator = (item: FormulaItem) =>
  ['+', '-', '*', '/', '.'].includes(`${item}`)

/**
 * HomePage component.
 */
export const HomePage: NextPage = () => {
  const [formula, setFormula] = useState<FormulaItem[]>([0])

  const lastItem = formula[formula.length - 1]
  const lastItemAsString = lastItem.toString()
  const isLastNumber = typeof lastItem === 'number'

  const pushItem = (item: FormulaItem) => {
    if (isLastNumber && typeof item === 'number') {
      if (lastItem === 0 && formula.includes('.')) {
        // 0.00 と小数点のあとに 0 が来る場合
        if (item === 0) {
          setFormula((v) => [...v, 0])
        } else {
          // 0.00 と小数点のあとに 0以外 が来る場合
          const units: number[] = []

          for (let i = formula.length - 1; formula[i] !== '.'; --i) {
            units.push(formula[i] as number)
          }

          setFormula((v) => v.slice(0, -units.length - 1))

          // [0, '.', ...,] を連結し新しく要素を追加
          setFormula((v) => [
            ...v.slice(0, -1),
            parseFloat(`${v[v.length - 1]}.${units.join('')}${item}`),
          ])
        }
        return
      }

      setFormula((v) => [...v.slice(0, -1), parseFloat(`${lastItem}${item}`)])
      return
    }

    if (lastItem === '.' && typeof item === 'number') {
      const lastNumber = formula[formula.length - 2]

      if (lastNumber === 0) {
        setFormula((v) => [...v, item])
        return
      }

      popItem() // last number
      popItem() // dot

      // replace
      setFormula((v) => [...v, parseFloat(`${lastNumber}.${item}`)])

      return
    }

    if (
      (item === '.' && lastItemAsString.includes('.')) ||
      formula.includes('.')
    ) {
      return
    }

    setFormula((v) => [...v, item])
  }

  const popItem = () => {
    if (isLastNumber && lastItemAsString.length > 1) {
      setFormula((v) => [
        ...v.slice(0, -1),
        parseFloat(lastItemAsString.slice(0, -1)),
      ])
      return
    }

    if (formula.length === 1) {
      setFormula([0])
      return
    }

    setFormula((v) => v.slice(0, -1))
  }

  const calculate = () => {}

  const allClear = () => {
    setFormula([0])
  }

  console.log(formula)

  return (
    <>
      <Head>
        <title>home - calculator-web-app</title>
      </Head>

      <Container>
        <div className="history">
          <div className="previous-result">0</div>
          <div className="current-result">{formula.join('')}</div>
        </div>
        <div className="lines">
          <div className="line">
            <button
              className="button-rounded button-secondary"
              onClick={allClear}
            >
              AC
            </button>
            <button className="button-rounded button-secondary">()</button>
            <button
              className="button-rounded button-secondary"
              onClick={() => pushItem('%')}
            >
              %
            </button>
            <button
              className="button-rounded button-primary"
              onClick={() => pushItem('/')}
            >
              /
            </button>
          </div>
          <div className="line">
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(7)}
            >
              7
            </button>
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(8)}
            >
              8
            </button>
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(9)}
            >
              9
            </button>
            <button
              className="button-rounded button-primary"
              onClick={() => pushItem('*')}
            >
              *
            </button>
          </div>
          <div className="line">
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(4)}
            >
              4
            </button>
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(5)}
            >
              5
            </button>
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(6)}
            >
              6
            </button>
            <button
              className="button-rounded button-primary"
              onClick={() => pushItem('-')}
            >
              -
            </button>
          </div>
          <div className="line">
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(1)}
            >
              1
            </button>
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(2)}
            >
              2
            </button>
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(3)}
            >
              3
            </button>
            <button
              className="button-rounded button-primary"
              onClick={() => pushItem('+')}
            >
              +
            </button>
          </div>
          <div className="line">
            <button
              className="button-rounded button-number"
              onClick={() => pushItem(0)}
            >
              0
            </button>
            <button
              className="button-rounded button-number"
              onClick={() => pushItem('.')}
            >
              .
            </button>
            <button
              className="button-rounded button-number"
              onClick={() => popItem()}
            >
              {'<'}
            </button>
            <button
              className="button-rounded button-primary"
              onClick={calculate}
            >
              =
            </button>
          </div>
        </div>
      </Container>

      <style global jsx>{`
        * {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }

        body {
          background: #101010;
          color: white;
        }

        .align-left {
          text-align: left;
        }

        .history {
          background: #303050;
          text-align: right;
          padding: 1rem 2rem;
          border-radius: 999px;
        }

        .previous-result {
          font-size: 1rem;
        }

        .current-result {
          font-size: 2rem;
        }

        .lines {
          margin: 16px 0;
        }

        .line {
          display: flex;
          margin-bottom: 16px;
        }

        .button-rounded {
          width: calc(100% / 4);
          aspect-ratio: 1;
          border-radius: 999px;
          margin: 0 8px;
          font-size: 1.5rem;

          border: none;
          outline: none;
          cursor: pointer;

          transition: all 140ms ease-in;
        }

        .button-rounded:active {
          transform: scale(0.99);
        }

        .button-width-2 {
          width: calc(100% / 4 * 2);
          aspect-ratio: 2;
        }

        .button-width-2.align-left {
          padding-left: calc(100% / 4 * 2 / 4 - 1rem);
        }

        .button-primary {
          background: #4343b0;
          color: white;
        }

        .button-primary:active {
          background: #2b2b6e;
          color: white;
        }

        .button-number {
          background: #303050;
          color: white;
        }

        .button-number:active {
          background: #202036;
          color: white;
        }

        .line button:first-child {
          margin-left: 0;
        }

        .line button:last-child {
          margin-right: 0;
        }
      `}</style>
    </>
  )
}

export default HomePage
