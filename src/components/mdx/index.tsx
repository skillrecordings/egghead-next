import Course from './course'
import Link from 'next/link'
import ResourceLink from './ResourceLink'
import Card from './Card'
import HeaderCard from './HeaderCard'
import QuestionReveal from './QuestionReveal'
import Callout from './Callout'
import ProseSection from './ProseSection'
import CheatSheet from './CheatSheet'
import DefaultLayout from '../../layouts'
import CodeBlock from './CodeBlock'

const mdxComponents = {
  Course,
  Link,
  ResourceLink,
  Card,
  HeaderCard,
  QuestionReveal,
  Callout,
  ProseSection,
  CheatSheet,
  DefaultLayout,
  pre: (props: any) => (
    <CodeBlock
      language={props.children.props.className}
      metastring={props.children.props.metastring}
    >
      {props.children.props.children}
    </CodeBlock>
  ),
}

export default mdxComponents
