import {
  GoVerified as CaseStudyIcon,
  GoChecklist as ApprovedIcon,
  GoEye as ReviewIcon,
  GoCircleSlash as RejectedIcon,
  GoDatabase as SuccessIcon,
} from 'react-icons/go'

export const icons = {
  CaseStudyIcon,
  ApprovedIcon,
  ReviewIcon,
  RejectedIcon,
  SuccessIcon,
}

const caseStudies = (S) =>
  S.listItem()
    .title('Case Studies')
    .icon(CaseStudyIcon)
    .child(
      S.list()
        .title('Case Studies')
        .items([
          S.listItem()
            .title('Published case studies')
            .schemaType('caseStudy')
            .icon(CaseStudyIcon)
            .child(
              S.documentList('caseStudy')
                .title('Published case studies')
                .menuItems(S.documentTypeList('caseStudy').getMenuItems())
                // Only show case studies with publish date earlier than now and that is not drafts
                .filter(
                  '_type == "caseStudy" && publishedAt < now() && !(_id in path("drafts.**"))'
                )
                .child((documentId) => S.document().documentId(documentId).schemaType('caseStudy'))
            ),
          S.documentTypeListItem('caseStudy').title('All case studies').icon(SuccessIcon),
        ])
    )

export default caseStudies
