import cx from 'classnames'

type HeadingProps = React.ComponentPropsWithoutRef<any> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
}

const Heading = ({children, as, className}: HeadingProps) => {
  const Component = as ?? 'p'
  return <Component className={cx(className)}>{children}</Component>
}

export default Heading
