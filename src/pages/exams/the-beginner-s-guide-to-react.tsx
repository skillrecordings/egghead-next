import * as React from 'react'
import CertificationExam from 'components/CertificationExam/index'
import examQuestions from './exam-questions'
import examMetaData from './exam-meta-data'

const CertificationExamPage = () => {
  return (
    <CertificationExam
      examQuestions={examQuestions}
      examMetaData={examMetaData}
    />
  )
}

export default CertificationExamPage
