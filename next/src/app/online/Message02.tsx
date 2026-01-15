import { Box, List, ListItem, Typography } from "@mui/material";


export default function Message02() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
      <Typography>
        人々の外出を減らすため、オンライン診療が臨時で対象拡大されています。<br />
        再診の方以外に、初診の患者さんも対象となりました。
      </Typography>
      <Typography sx={{ mt: 1 }}>
        ※「再診」とは「薬の続きをもらう」ような状態の患者さんです。
        <br />
        ※診察券を持っているだけでは再診扱いにはなりませんのでご注意ください。
      </Typography>
      <List sx={{ listStyleType: "demical", pl: 6 }}>
        <ListItem sx={{ display: "list-item" }}>
          電話またはLINEで、"オンライン診療を希望" とお伝えください。<br />
          その際に、下記を確認しますのでご準備をお願いします。
        </ListItem>
        <Typography component="div" sx={{ pl: 4 }}>
          ・受診される方の氏名、診察券番号（分からない場合は生年月日）<br />
          ・連絡のつく電話番号<br />
          ・処方箋を希望される日付<br />
          ・薬を受け取られる調剤薬局の名前、支店名<br />
          <br />
        </Typography>
        <ListItem sx={{ display: "list-item" }}>
          保険証をFAXまたはLINEでお送りください。<br />
          同じ月に受診されており、保険証の変更がない場合には必要ありません。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          処方箋を希望された日に当院の医師よりお電話いたします。<br />
          必要な薬がある場合にはご確認をお願いします。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          ご連絡いただいた調剤薬局でお薬を受け取ってください。<br />
          処方箋の有効期限は4日です。4日以内に受け取りをお願いします。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          当院へのお支払いをお願いします（後日で構いませんが、振り込みも可能です）<br />
          窓口でも対応いたしますが、院内に入るのが心配な方はインターホンを鳴らしてください。<br />
          スタッフが院外でお会計いたします。<br />
        </ListItem>
      </List>
    </Box>
  );
}
