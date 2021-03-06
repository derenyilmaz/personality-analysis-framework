import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Header,
  Segment,
  Form,
  Table,
  Radio,
  TableCellProps,
  Button,
} from "semantic-ui-react";
import BottomMenu from "./Menu";
import { useHistory } from "react-router-dom";
import { server, getKey } from "./Constants";
import { toast } from "react-toastify";

declare global {
  type Dictionary<T> = { [key: string]: T };
}
const map: Dictionary<number> = {};
for (let i = 0; i < 50; i++) {
  map["q" + i] = 0;
}

const Questionnaire = () => {
  const [state, setState] = useState({ questions: map });

  const history = useHistory();

  const handleChange = (e: any, { name, value }: TableCellProps) => {
    const prevState = state.questions;
    prevState[name] = Number(value);
    setState({ questions: prevState });
  };

  const hash = getKey("hash");
  const secret = getKey("secret");

  const questionTexts = [
    "Etrafına neşe saçan bir insanım.",
    "Başkaları hakkında fazla endişelenmem.",
    "Her zaman hazırım.",
    "Kolayca streslenirim.",
    "Kelime dağarcığım zengindir.",
    "Fazla konuşmam.",
    "İnsanlar ilgimi çeker.",
    "Eşyalarımı etrafta bırakırım.",
    "Çoğu zaman sakinimdir.",
    "Soyut fikirleri anlamakta zorlanırım.",
    "İnsanlarla birlikteyken rahat hissederim.",
    "İnsanlara hakaret ederim.",
    "Detaylara dikkat ederim.",
    "Bir şeyleri dert edinirim.",
    "Canlı bir hayalgücüm var.",
    "Genelde arkada dururum.",
    "Başkalarının hissetiklerini anlarım.",
    "Bir şeyleri çok dağıtırım.",
    "Nadiren hüzünlü hissederim.",
    "Soyut fikirler ilgimi çekmez.",
    "Konuşmaları ben başlatırım.",
    "Başkalarının prolemleri ile ilgilenmem.",
    "İşlerimi hemen hallederim.",
    "Kolayca rahatsız olurum.",
    "Harika fikirlerim vardır.",
    "Söyleyecek fazla şeyim yok.",
    "Yumuşak bir yüreğim var.",
    "Sıklıkla eşyaları doğru yerlerine koymayı unuturum.",
    "Kolayca üzülürüm.",
    "İyi bir hayalgücüm yok.",
    "Partilerde bir sürü farklı insanla konuşurum.",
    "Başkalarıyla pek ilgilenmem.",
    "Düzen hoşuma gider.",
    "Ruh halim sıklıkla değişir.",
    "Bir şeyleri anlamakta hızlıyım.",
    "Dikkati kendime çekmekten hoşlanmam.",
    "Başkaları için vakit ayırırım.",
    "İşlerden kaytarırım.",
    "Ruh halim sıklıkla değişir.",
    "Zor kelimeler kullanırım.",
    "İlgi odağı olmak beni rahatsız etmez.",
    "Başkalarının duygularını hissederim.",
    "Bir programa uyarım.",
    "Kolayca rahatsız olurum.",
    "Bir şeyleri derinlemesine düşünmek için vakit harcarım.",
    "Yabancı insanların arasındayken sessiz kalırım.",
    "İnsanlara kendilerini rahat hissettiririm.",
    "İşimde titizimdir.",
    "Sıkça hüzünlü hissederim.",
    "Aklım fikirlerle doludur.",
  ];

  const question = (text: string, nr: number) => (
    <Table.Row textAlign="center">
      <Table.Cell textAlign="left">{text}</Table.Cell>
      <Table.Cell>
        <Radio
          name={"q" + nr}
          value="1"
          checked={state.questions["q" + nr] === 1}
          onChange={handleChange}
        />
      </Table.Cell>
      <Table.Cell>
        <Radio
          name={"q" + nr}
          value="2"
          checked={state.questions["q" + nr] === 2}
          onChange={handleChange}
        />
      </Table.Cell>
      <Table.Cell>
        <Radio
          name={"q" + nr}
          value="3"
          checked={state.questions["q" + nr] === 3}
          onChange={handleChange}
        />
      </Table.Cell>
      <Table.Cell>
        <Radio
          name={"q" + nr}
          value="4"
          checked={state.questions["q" + nr] === 4}
          onChange={handleChange}
        />
      </Table.Cell>
      <Table.Cell>
        <Radio
          name={"q" + nr}
          value="5"
          checked={state.questions["q" + nr] === 5}
          onChange={handleChange}
        />
      </Table.Cell>
    </Table.Row>
  );

  const renderQuestions = () => {
    const r = [];
    for (var i = 0; i < 50; i++) {
      r.push(question(questionTexts[i], i));
    }
    return r;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { questions } = state;

    const formData = new URLSearchParams();
    if (hash !== null && secret !== null) {
      formData.append("hash", hash);
      formData.append("secret", secret);
    }
    for (let i = 0; i < 50; i++) {
      formData.append("q" + i, questions["q" + i].toString());
    }

    for (let i = 0; i < 50; i++) {
      if (questions["q" + i] === 0) {
        toast.error("Anketteki her soruyu işaretlemeniz gerekiyor.");
        return;
      }
    }

    fetch(server + "questionnaire", {
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
          localStorage.setItem("isLoggedIn", JSON.stringify(false));
          return Promise.reject(new Error("Unknown error occurred"));
        }
      })
      .then((r) => r!.json())
      .then((r) => {
        const ocean = r!.hash;
        const ocean_q = r!.q_hash;
        setTimeout(() => {
          history.push("/compare?hash=" + ocean + "&questionnaire=" + ocean_q);
        }, 2500);
        toast.success(
          "Anketi doldurduğunuz için teşekkürler! Sonuç sayfasına yönlendiriliyorsunuz..."
        );
      })
      .catch((e) => {
        //toast.error(e.message);
        localStorage.setItem("isLoggedIn", JSON.stringify(false));
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Segment>
        <Container>
          <Grid>
            <Grid.Row columns="equal" centered>
              <Grid.Column width={16}>
                <Header size="large">Kişilik Anketi</Header>
                <Form onSubmit={handleSubmit}>
                  <p>
                    Aşağıda, sizden kişilik tipinizi belirlemek için
                    yanıtlamanızı istediğimiz 50 soru bulunmaktadır. Bu anket
                    sonucunda, Big 5 kişilik sonucunuz elde edilecek ve bu sonuç
                    yapay zeka modelimizin iyileştirilmesi için kullanılacaktır.
                    Sonuçlarınız herhangi bir yerde paylaşılmayacaktır.{" "}
                  </p>

                  <p>
                    Bu test, Oregon Araştırma Enstitüsü’nün Uluslararası Açık
                    Erişim Kişilik Araştırmaları Envanteri’nin bir parçasıdır.{" "}
                  </p>

                  <p>
                    Testi yanıtlamaktan istediğiniz an vazgeçebilirsiniz, ancak
                    testi tamamlamanız bizi çok mutlu eder. Anketimizi
                    tamamlayarak veri bilimi alanındaki çalışmalarımıza katkı
                    sağlamış olacaksınız.
                  </p>

                  <p>
                    Bu aşamaya devam ettiğiniz için şimdiden teşekkür ederiz!
                  </p>

                  <Table definition>
                    <Table.Header>
                      <Table.Row textAlign="center">
                        <Table.HeaderCell width="6" className="coverUp" />
                        <Table.HeaderCell width="2">
                          Kesinlikle Katılmıyorum
                        </Table.HeaderCell>
                        <Table.HeaderCell width="2">
                          Kısmen Katılmıyorum
                        </Table.HeaderCell>
                        <Table.HeaderCell width="2">Nötr</Table.HeaderCell>
                        <Table.HeaderCell width="2">
                          Kısmen Katılıyorum
                        </Table.HeaderCell>
                        <Table.HeaderCell width="2">
                          Kesinlikle Katılıyorum
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>{renderQuestions()}</Table.Body>
                  </Table>
                  <Button.Group widths="8" fluid>
                    <Button
                      onClick={() => {
                        history.push("share/" + hash);
                      }}
                    >
                      Sonuç sayfasına geri dön
                    </Button>

                    <Button type="submit" primary floated="right">
                      Gönder
                    </Button>
                  </Button.Group>
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

export default Questionnaire;
