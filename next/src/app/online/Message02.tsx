import { Box, Typography, Paper } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function Message02() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="body1" sx={{ lineHeight: 2, mb: 3 }}>
        オンライン診療をご希望の方は、お気軽にお問い合わせください。<br />
        ご不明な点やご相談がございましたら、スタッフが丁寧にご案内いたします。
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "#f5fafa",
          border: "1px solid #d0e8ec",
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" color="#2a7d8f" sx={{ mb: 2 }}>
          お問い合わせ先
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PhoneIcon sx={{ color: "#2a7d8f", fontSize: 20 }} />
            <Typography variant="body2">
              TEL：076-255-0337
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <EmailIcon sx={{ color: "#2a7d8f", fontSize: 20 }} />
            <Typography variant="body2">
              メール：info@mizuki-clinic.jp
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
