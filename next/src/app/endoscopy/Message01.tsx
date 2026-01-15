import { Box, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#black", mb: 1 }}>
        最新の内視鏡医療機器を導入
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, ml: 4, }}>
        胃内視鏡の最新機種を導入。止血術や異物除去手術等も行います。<br></br>
        また、鼻から診る経鼻内視鏡の最新機種も導入しています。<br></br>
        美しい画像で、精度の高い検査が可能です。ご希望の方はお申し出ください
      </Typography>
    </Box>
  );
}
