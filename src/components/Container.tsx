/**
 * Container props.
 */
export type ContainerProps = {
  children?: React.ReactNode
}

/**
 * Container component.
 */
export const Container: React.VFC<ContainerProps> = (props) => {
  const { children } = props

  return (
    <>
      <div className="container">{children}</div>

      <style jsx>{`
        .container {
          max-width: 375px;
          margin: 0 auto;
          padding: 32px 0;
        }
      `}</style>
    </>
  )
}
