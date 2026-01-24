import { Box, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1.5 }}>
        最新の内視鏡医療機器を導入
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.8, ml: 2 }}>
        胃内視鏡の最新機種を導入。止血術や異物除去手術等も行います。<br />
        また、鼻から診る経鼻内視鏡の最新機種も導入しています。<br />
        美しい画像で、精度の高い検査が可能です。ご希望の方はお申し出ください
      </Typography>
    </Box>
  );
}
