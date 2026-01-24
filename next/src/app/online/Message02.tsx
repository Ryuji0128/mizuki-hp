import { Box, List, ListItem, Typography } from "@mui/material";


export default function Message02() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
        人々の外出を減らすため、オンライン診療が臨時で対象拡大されています。
        再診の方以外に、初診の患者さんも対象となりました。
      </Typography>
      <Typography variant="body2" sx={{ mt: 1.5, mb: 2, lineHeight: 1.8, color: "text.secondary" }}>
        ※「再診」とは「薬の続きをもらう」ような状態の患者さんです。<br />
        ※診察券を持っているだけでは再診扱いにはなりませんのでご注意ください。
      </Typography>
      <List sx={{ listStyleType: "decimal", pl: 4 }}>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          電話またはLINEで、"オンライン診療を希望" とお伝えください。
          その際に、下記を確認しますのでご準備をお願いします。
          <Typography component="div" sx={{ pl: 2, mt: 1, lineHeight: 1.8, color: "text.secondary" }}>
            ・受診される方の氏名、診察券番号（分からない場合は生年月日）<br />
            ・連絡のつく電話番号<br />
            ・処方箋を希望される日付<br />
            ・薬を受け取られる調剤薬局の名前、支店名
          </Typography>
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          保険証をFAXまたはLINEでお送りください。
          同じ月に受診されており、保険証の変更がない場合には必要ありません。
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          処方箋を希望された日に当院の医師よりお電話いたします。
          必要な薬がある場合にはご確認をお願いします。
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          ご連絡いただいた調剤薬局でお薬を受け取ってください。
          処方箋の有効期限は4日です。4日以内に受け取りをお願いします。
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          当院へのお支払いをお願いします（後日で構いませんが、振り込みも可能です）
          窓口でも対応いたしますが、院内に入るのが心配な方はインターホンを鳴らしてください。
          スタッフが院外でお会計いたします。
        </ListItem>
      </List>
    </Box>
  );
}
