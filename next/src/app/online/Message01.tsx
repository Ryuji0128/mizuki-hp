import { Box, Button, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        新型コロナ感染の拡大に伴い、外出の自粛がより一層求められる状況で、
        医療機関を受診すべきかどうか迷う方も多いかと思います。
        そういう方々のために、LINEで健康相談を受け付けることにしました。
        下記のボタンからお友だち登録していただき、トーク機能でご相談ください。
        お待たせする場合もありますが、全て医師が対応いたします。
        是非、ご活用ください。
      </Typography>
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant="contained"
          href="https://line.me/ti/p/j975cE_dH_"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: "#06C755",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#05b04c",
            },
          }}
        >
          LINEで友だち追加
        </Button>
      </Box>
    </Box>
  );
}
