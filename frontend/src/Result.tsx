import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Grid,
  Header,
  Segment,
  Progress,
  Image,
  Form,
  Button,
} from "semantic-ui-react";
import fetch from "isomorphic-unfetch";
import BottomMenu from "./Menu";
import {
  server,
  frontend,
  getKey,
  describeBigFive,
  labelsBigFive,
} from "./Constants";

export const printBigFive = () => {
  const description = [];
  for (let i = 0; i < 5; i++) {
    const temp = (
      <>
        <Header size="medium">{labelsBigFive[i]}</Header>
        <p>{describeBigFive[i]}</p>
      </>
    );
    description.push(temp);
  }
  return description.map((item) => item);
};

const Result = () => {
  const [state, setState] = useState({
    loaded: false,
    image: "",
    dataSize: undefined,
    canQuestionnaire: false,
    percentage: 0,
  });

  const history = useHistory();

  const hash = getKey("hash");
  const autoShare = localStorage.getItem("autoShare") === "true";

  const startAnalysis = () => {
    fetch(server + "result?hash=" + hash + "&auto_share=" + autoShare, {
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
            localStorage.setItem("autoShare", JSON.stringify(false));
            const response_image = response.hash;
            if (state.image !== response_image) {
              setState({
                ...state,
                loaded: true,
                image: response_image,
                dataSize: response.dataSize,
              });
            }
          } else {
            const dataSize = response.dataSize;
            if (state.dataSize !== dataSize) {
              localStorage.setItem("startTime", JSON.stringify(Date.now()));
              setState({
                ...state,
                dataSize: dataSize,
              });
            }
            //setTimeout(startAnalysis, 10000);
          }
        } else {
          //console.log("error");
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const formData = new URLSearchParams();
  const secret = localStorage.getItem("secret");
  const r_hash = localStorage.getItem("hash");
  const takenTime = localStorage.getItem("takenTime");
  if (Date.now() - Number(takenTime) < 15 * 60 * 1000) {
    if (
      r_hash !== undefined &&
      secret !== undefined &&
      r_hash !== null &&
      secret !== null
    ) {
      formData.append("hash", JSON.parse(r_hash));
      formData.append("secret", JSON.parse(secret));
    }
  }

  const getCanQuestionnaire = () => {
    fetch(server + "validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
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
          //console.log(response.finished);
          if (response.finished === false) {
            if (state.canQuestionnaire !== true) {
              setState({ ...state, canQuestionnaire: true });
            }
          }
        } else {
          //console.log("error");
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const estimate = [
    "Tweetlerinizin analiz edilmesi yakla????k olarak ",
    " dakika s??recektir.",
  ];

  useEffect(() => {
    startAnalysis();
    getCanQuestionnaire();
    const interval = setInterval(() => {
      const timePassed = Math.floor(
        (Date.now() - Number(localStorage.getItem("takenTime"))) / 1000
      );
      const tempPercentage = Math.floor(
        (100 * (timePassed * 6)) / state.dataSize!
      );
      const currentPercentage = state.loaded
        ? 100
        : tempPercentage > 99
        ? 99
        : tempPercentage;
      setState({
        ...state,
        percentage: currentPercentage,
      });
    }, 10000);
    return () => clearInterval(interval);
  });

  const imageUrl = server + "image?hash=" + state.image;

  const resultUrl = frontend + "result?hash=" + hash;

  const shareLink = () => (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:url" content={frontend} />
      <meta
        property="og:title"
        content="Tweet Ki??ili??im | Twitter Ki??ilik Analizi"
      />
      <meta
        property="og:description"
        content="Bilimsel olarak kan??tlanm???? y??ntemimiz ile tweetlerinizi analiz edip Twitter'da nas??l bir ki??ilik temsil etti??inizi hesapl??yoruz."
      />
      <meta property="og:image" content={imageUrl} />
    </>
  );

  const redirectQuestionnaire = () => {
    history.push("questionnaire?" + formData);
  };

  const participateQuestionnaire = (
    <Segment textAlign="center" vertical>
      <Form.Field>
        <Button
          color="green"
          size="large"
          onClick={redirectQuestionnaire}
          fluid
        >
          Twitter ki??ili??inizi ger??ek ki??ili??inizle k??yaslamak ister misiniz?
        </Button>
      </Form.Field>
    </Segment>
  );

  const progressBar = (
    <Progress percent={state.percentage} autoSuccess active />
  );

  return (
    <>
      {state.loaded !== false && shareLink}
      <Segment>
        <Container>
          <Grid>
            <Grid.Row columns="equal" centered>
              <Grid.Column width={16}>
                <Header size="large">Tweetlerinizin Ki??ili??i Nas??l?</Header>
                {state.loaded !== false && (
                  <>
                    <Image src={imageUrl} size="big" centered />
                    <Header size="large">Ki??ilik ??zellikleri</Header>
                    <p>
                      Grafikte temsil edilen 5 k????e, ki??ili??inizin 5 ??zelli??ini
                      temsil etmekte. Bunlarla ilgili ayr??nt??l?? bilgiyi a??a????da
                      bulabilirsiniz.
                    </p>
                    {printBigFive()}
                    {state.canQuestionnaire &&
                    r_hash !== null &&
                    JSON.parse(r_hash) === hash
                      ? participateQuestionnaire
                      : ""}
                  </>
                )}
                {state.loaded === false && state.dataSize !== 0 && (
                  <>
                    <p>Tweetleriniz analiz ediliyor...</p>
                    <p>
                      {state.dataSize !== undefined &&
                        estimate[0] +
                          Math.ceil(state.dataSize! / 700) +
                          estimate[1]}
                    </p>
                    <p>
                      Bu s??re??te, bu sayfay?? kapatabilirsiniz. Sayfay??
                      kapat??rsan??z, sonu??lar??n??za <a href={resultUrl}>bu</a>{" "}
                      adresten ula??abilirsiniz. E??er sonu??lar??n??z??n otomatik
                      payla????lmas??n?? se??tiyseniz, sonu??lar??n??z Twitter
                      hesab??n??zdan da payla????lacakt??r.
                    </p>
                    {progressBar}
                  </>
                )}
                {state.loaded === false && state.dataSize === 0 && (
                  <>
                    <p>
                      Ki??ilik analizi yap??labilmesi i??in yeterli orijinal
                      tweetiniz yok :(
                    </p>
                  </>
                )}
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
