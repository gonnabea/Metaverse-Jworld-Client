import React from "react"
import styled from "styled-components"

const EmptyBox = styled.section`
  height: 250px;
`
const Text = styled.div`
  width: 300px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: fantasy;
  font-size: 20px;
`

export default () => {
  return (
    <EmptyBox>
      <Text></Text>
    </EmptyBox>
  )
}