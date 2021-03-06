import React, { useState } from "react";
import {
  Container,
  Grid,
  Form,
  Button,
  Header,
  Segment,
  Icon,
  Checkbox,
  CheckboxProps,
} from "semantic-ui-react";
import fetch from "isomorphic-unfetch";
import BottomMenu from "./Menu";
import { server } from "./Constants";

const Home = () => {
  const [state, setState] = useState({ share: true });
  const handleChange = (e: any, { checked }: CheckboxProps) => {
    let status = checked === true;
    setState({ share: status });
  };
  const Login = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    localStorage.setItem("autoShare", JSON.stringify(state.share));
    fetch(server, {
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
        window.location = response!.url;
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  return (
    <>
      <Segment>
        <Container>
          <Grid>
            <Grid.Row columns="equal" centered>
              <Grid.Column width={16}>
                <Header size='large'>Tweetlerinizin Kişiliği Nasıl?</Header>
                <p>
                  Bilimsel olarak kanıtlanmış yöntemimiz ile tweetlerinizi
                  analiz edip Twitter'da nasıl bir kişilik temsil ettiğinizi
                  hesaplıyoruz.
                </p>
                <p>
                  Gelişmiş yapay zeka yöntemlerimizi kullanarak kişiliğinizi
                  görüntülemek için Twitter hesabınızla giriş yapın:
                </p>

                <Form>
                  <Segment textAlign="center" vertical>
                    <Form.Field>
                      <Checkbox
                        toggle
                        defaultChecked
                        label="Sonucumu Twitter'da paylaş"
                        onChange={handleChange}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Button color="twitter" size="large" onClick={Login}>
                        <Icon name="twitter" /> Twitter ile Giriş Yapın
                      </Button>
                    </Form.Field>
                  </Segment>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
      <BottomMenu />
    </>
  );
};

export default Home;
