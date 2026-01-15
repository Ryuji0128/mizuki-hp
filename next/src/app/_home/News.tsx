import { Box, Typography } from "@mui/material";

export default function Message02() {
  return (
    <Box sx={{ maxWidth: "100 %", textAlign: "center", mx: "auto", lineHeight: 1.8 }}>
      <Typography variant="body1" lineHeight={2.0} color="error.main">
        発熱外来においては受診歴の有無に関わらず、発熱その他感染症を疑わせるような症状を呈する<br></br>
        患者さんの受入れを行い、感染防止対策として発熱患者さんの動線を分ける対応を行っております。<br></br>
      </Typography>
    </Box>
  );
}
