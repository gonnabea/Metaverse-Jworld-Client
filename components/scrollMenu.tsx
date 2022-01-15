import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Container = styled.div`
  font-size: 12px;
  
`
const ImageContainer = styled.div`
  margin-bottom: 5px;
  height: 250px;
  
`

const Image = styled.img`
  

  background-image: url(${(props) => props.bgUrl});
  width: 200px;
  height: 250px;
  max-width: none !important;
  background-size: 180px 250px;
  background-repeat: no-repeat;
  background-position: left;
  border-radius: 4px;
  margin-right: 40px;
  z-index: 200;
  animation: hoverImgOut 0.5s forwards;
  :hover {
    position: block;
  }
  @keyframes hoverImg {
    from {
      width: 200px;
    }
    to {
      width: 500px;
      box-shadow: 0 0 30px skyblue;
    }
  }
  @keyframes hoverImgOut {
    from {
      width: 500px;
      box-shadow: 0 0 30px skyblue;
      z-index: -999;
    }
    to {
      width: 180px;
      z-index: 200;
    }
  }
  @media screen and (max-width: 420px) {
    height: 90%;
    background-size: 140px;
    @keyframes hoverImg {
      from {
        width: 140px;
      }
      to {
        width: 300px;
        box-shadow: 0 0 30px skyblue;
      }
    }
    @keyframes hoverImgOut {
      from {
        width: 300px;
        box-shadow: 0 0 30px skyblue;
        z-index: -999;
      }
      to {
        width: 140px;
        z-index: 200;
      }
    }
  }
`

const Infos = styled.div`
  position: relative;
  bottom: 200px;
  width: 50%;
  left: 0;
  opacity: 0;
  display: flex;
  flex-direction: column;
  z-index: -1;
  @keyframes showInfos {
    from {
        opacity: 0;
    }
    to {
      opacity: 1;
      left: 200px;
     
    }
  }
  @keyframes hideInfos {
    from {
      left: 200px;
      
    }
    to {
      left: 0;
    
    }
  }
`

const Rating = styled.span`
  color: orange;
  font-size: 18px;
`

const Title = styled.span`

  display: block;
  margin-bottom: 3px;
  font-weight: 700;
  font-size: 25px;
`

const Year = styled.span`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;
`

const Overview = styled.p`
  color: gray;
  font-size: 15px;
  overflow: hidden;
  line-height: 150%;
`

const ScrollMenu = ({
  imageUrl,
  title,
  overview,
}) => {

  return (
      <Container>
        <ImageContainer>
          <Image
            onMouseEnter={(e) => mouseOn(e)}
            onMouseLeave={(e) => mouseOut(e)}
            bgUrl={imageUrl ? imageUrl : "No_Image.jpg"}
          />
          <Infos>
            <Title>{title}</Title>
            {/* <Rating>
              <span role="img" aria-label="rating">
                {rating ? "★" : ""}
              </span>{" "}
              {rating ? `${rating} / 10` : ""}
            </Rating>
            <Year>{year}</Year> */}
            <Overview>{overview ? overview.substring(80, 0) + "..." : ""}</Overview>
          </Infos>
        </ImageContainer>
      </Container>
    
  )
}

ScrollMenu.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  rating: PropTypes.number,
  year: PropTypes.string,
  isMovie: PropTypes.bool,
}

function mouseOn(e) {
  const { childNodes: infoBox } = e.target.parentNode
  e.target.style.animation = "hoverImg 0.3s forwards"
  infoBox[1].style.animation = "showInfos 0.3s forwards"
}

function mouseOut(e) {
  const { childNodes: infoBox } = e.target.parentNode
  e.target.style.animation = "hoverImgOut 0s forwards" //버그 fix v
  infoBox[1].style.animation = "hideInfos 0.3s forwards"
}

export default ScrollMenu