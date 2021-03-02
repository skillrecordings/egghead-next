import React from 'react'

export const mathInlineIcon = () => (
  <span>
    <span style={{fontWeight: 'bold'}}>∑</span>b
  </span>
)
export const mathIcon = () => <span style={{fontWeight: 'bold'}}>∑</span>

export const highlightIcon = () => <span style={{fontWeight: 'bold'}}>H</span>

export const highlightRender = (props) => (
  <span style={{backgroundColor: 'yellow'}}>{props.children}</span>
)
