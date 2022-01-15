import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import EmptySpace from "./EmptySpace"

const Container = styled.div`
  width: 100vw;
  padding: 0px 10px;
  :not(:last-child) {
    margin-bottom: 50px;
  }
`

const Title = styled.cite`
  font-size: 24px;
  font-weight: 700;
  color: black;

`

const Flex = styled.div`
  margin-top: 25px;
  display: flex;
  overflow: hidden;
  position: relative;
  @media only screen and (max-width: 420px) {
    overflow-x: auto;
  }
`

const SlideBtn = styled.button`
  position: sticky;
  ${(props) => (props.direction === "right" ? { right: "0" } : { left: "0" })};
  top: 0;
  height: 250px;
  background-color: rgba(0, 0, 0, 0.3);
  font-size: 50px;
  color: white;
  font-weight: 700;
  z-index: 100;
  cursor: pointer;
  :hover {
    background-color: black;
  }
  @media only screen and (max-width: 420px) {
    display: none;
  }
`

const Slider = ({ title, children }) => {
  let index = 0

  const leftSliding = (e) => {
    const { parentNode: flexBox } = e.target
    if (index > 0) {
      index -= 1
      flexBox.scrollTo({
        left: (flexBox.clientWidth / 2) * index,
        behavior: "smooth",
      })
    }
  }

  const rightSliding = (e) => {
    const { parentNode: flexBox } = e.target
    console.log(flexBox.scrollWidth)
    console.log((flexBox.clientWidth / 2) * index)
    if (flexBox.scrollWidth > (flexBox.clientWidth / 2) * (index + 2)) {
      index += 1
      flexBox.scrollTo({
        left: (flexBox.clientWidth / 2) * index,
        behavior: "smooth",
      })
    }
  }

  return (
    <Container>
      <Title>{title}</Title>
      <Flex>
        <SlideBtn onClick={leftSliding}>{`<`}</SlideBtn>
        {children}
        <EmptySpace />
        <EmptySpace />
        <EmptySpace />
        <EmptySpace />
        <EmptySpace />
        <EmptySpace />
        <EmptySpace />




        <SlideBtn onClick={rightSliding} direction="right">{`>`}</SlideBtn>
      </Flex>
    </Container>
  )
}

Slider.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
}

export default Slider;