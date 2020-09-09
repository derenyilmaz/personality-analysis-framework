import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Divider,
  Header,
  Segment,
  Progress, Image,
} from "semantic-ui-react";
import fetch from "isomorphic-unfetch";
import BottomMenu from "./Menu";
import { server, frontend, getKey } from "./Constants";

const Result = () => {
  const [state, setState] = useState({ loaded: false, image: '' });

  let percent = 30;

  const hash = getKey("hash");

  const startAnalysis = () => {
    fetch(server + "result?hash=" + hash, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (r.ok) {
          return r;
        }
        if (r.status === 401 || r.status === 403 || r.status === 500) {
          return Promise.reject(new Error("Unknown error occurred"));
        }
      })
      .then((r) => r!.json())
      .then((response) => {
        if (response.status === 200) {
          if (response.finished === true) {
            const response_image = response.hash;
            if (state.image !== response_image) {
              setState({ loaded: true, image: response_image});
            }
          } else {
            console.log("waiting");
            percent += 5;
            setTimeout(startAnalysis, 5000);
          }
        } else {
          console.log("error");
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  

  useEffect(() => startAnalysis());
  
  const imageUrl = server + "image?hash=" + state.image;

  const shareLink = () => (<><meta name="twitter:card" content="summary_large_image" />
  <meta property="og:url" content={frontend} />
  <meta property="og:title" content="Tweetleriniz ile Kişilik Analizi" />
  <meta property="og:description" content="Bilimsel olarak kanıtlanmış yöntemimiz ile tweetlerinizi analiz edip Twitter'da nasıl bir kişilik temsil ettiğinizi hesaplıyoruz. Makine Öğrenmesi kullanarak yöntemimizi sürekli iyileştiriyoruz." />
  <meta property="og:image" content={imageUrl} /></>);
  return (
    <>
    {state.loaded !== false && shareLink}
      <Segment>
        <Container>
          <Grid>
            <Grid.Row columns="equal" centered>
              <Grid.Column width={16}>
                <Header>Tweetlerinizin Kişiliği Nasıl?</Header>
                {state.loaded !== false && (
                  <Image src={imageUrl} size='big' centered/>
                )}
                {state.loaded === false && (
                  <>
                    <p>Tweetleriniz analiz ediliyor</p>
                    <Progress
                      percent={state.loaded ? 100 : percent}
                      autoSuccess
                      active
                    />
                  </>
                )}
                <Divider />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
      <BottomMenu />
    </>
  );
};

export default Result;
