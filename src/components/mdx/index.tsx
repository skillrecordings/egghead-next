import Course from './course'
import Link from 'next/link'
import ResourceLink from './resource-link'
import Card from './card'
import HeaderCard from './header-card'
import QuestionReveal from './question-reveal'
import Callout from './callout'
import ProseSection from './prose-section'
import CheatSheet from './cheat-sheet'
import DefaultLayout from '../../layouts'
import CodeBlock from './code-block'
import ArticleCourseCard from 'components/blog/article-course-card'
import ArticleTalkCard from 'components/blog/article-talk-card'
import TopicInterestEmailEntryForm from './topic-interest-form'
import ArticleSeriesList from './article-series-list'
// @ts-ignore
import {TwitterTweetEmbed} from 'react-twitter-embed'

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
  TwitterTweetEmbed,
  DefaultLayout,
  ArticleCourseCard,
  ArticleTalkCard,
  ArticleSeriesList,
  TopicInterestEmailEntryForm,
  pre: (props: any) => (
    <CodeBlock
      language={props.children.props.className || ''}
      metastring={props.children.props.metastring}
    >
      {props.children.props.children}
    </CodeBlock>
  ),
}

export default mdxComponents
