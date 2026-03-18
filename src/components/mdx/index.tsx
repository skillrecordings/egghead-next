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
import ArticleCourseCard from '@/components/blog/article-course-card'
import ArticleTalkCard from '@/components/blog/article-talk-card'
import TopicInterestEmailEntryForm from './topic-interest-form'
import ArticleSeriesList from './article-series-list'
// react-twitter-embed v3 uses string refs which were removed in React 19.
// Use our own React 19-safe wrapper instead.
import {TwitterTweetEmbed} from './twitter-tweet-embed'
const mdxComponents = {
  Course,
  Link: (props: any) => <Link {...props} />,
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
  ResponsiveEmbed: () => <></>,
  LessonWidget: () => <></>,
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
