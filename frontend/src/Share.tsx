import React from "react";
import {
  Container,
  Grid,
  Header,
  Segment,
  Image,
} from "semantic-ui-react";
import BottomMenu from "./Menu";
import { server } from "./Constants";

const Share = (props: any) => {
  const { match } = props;
  let { hash } = match.params;
  const imageUrl = server + "image?hash=" + hash;

  return (
    <>
      <Segment>
        <Container>
          <Grid>
            <Grid.Row columns="equal" centered>
              <Grid.Column width={16}>
                <Header size='large'>Tweetlerinizin Kişiliği Nasıl?</Header>
                <Image src={imageUrl} size="big" centered/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
      <BottomMenu />
    </>
  );
};

export default Share;
