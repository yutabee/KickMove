import React, { memo } from 'react'
import styled from 'styled-components'

export const Similarity = memo(({similarity}) => {
  return (
    <div>
        <SP>類似度</SP>
        <SP>{(1 - similarity)*100}%</SP>
    </div>
  )
})

const SP = styled.div`
  font-size: 30px;
  font-weight: bold;
`