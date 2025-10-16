import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

export default function ConsultationHours() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 0 }}>
      {/* 診療時間表 */}
      <TableContainer>
        <Table sx={{ borderCollapse: "separate", borderSpacing: 0, borderRadius: 2, overflow: "hidden" }}>
          {/* 曜日ヘッダー */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4AA3C0" }}>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", borderRight: "1px solid #fff" }}>
                &nbsp;
              </TableCell>
              {["月", "火", "水", "木", "金", "土"].map((day) => (
                <TableCell
                  key={day}
                  align="center"
                  sx={{ color: "#fff", fontWeight: "bold", borderRight: "1px solid #fff" }}
                >
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* 午前 */}
          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#E9F6FA",
                  borderRight: "1px solid #fff",
                }}
              >
                診察・検査(9:00–12:30)
              </TableCell>
              {["○", "○", "○", "○", "○", "○"].map((symbol, i) => (
                <TableCell key={i} align="center" sx={{ backgroundColor: "#E9F6FA", fontSize: "1.5rem", fontWeight: "bold", lineHeight: 1.2, }}>
                  {symbol}
                </TableCell>
              ))}
            </TableRow>

            {/* 午後 */}
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#B8E7FF",
                  borderRight: "1px solid #fff",
                }}
              >
                診察・検査(16:00–18:00)
              </TableCell>
              {["○", "○", "休", "○", "○", "休"].map((symbol, i) => (
                <TableCell key={i} align="center" sx={{ backgroundColor: "#E9F6FA", fontSize: "1.5rem", fontWeight: "bold", lineHeight: 1.2, }}>
                  {symbol}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#black", mb: 1 }}>
        ※休診日：水曜日午後・土曜日午後、日曜日、祝日
      </Typography>
      <Typography variant="body1" lineHeight={1.8}>
        <br></br>
        当院では、出来るだけ多くの方に検査を受けていただけるように土曜日も検査が可能です。<br></br>
        内視鏡検査をご希望の方は、ネットもしくはお電話にてご予約ください。<br></br>
        ➡ネットからのご予約は、
        <Link
          href="https://reserva.be/kimuraowarichoclinic?simple=1" // ← ここを予約ページURLに変更
          underline="hover"
          color="primary"
          fontWeight="bold"
          target="_blank" // 新しいタブで開く（任意）
          rel="noopener"
        >
          こちら
        </Link>
        <br></br>
        <br></br>
        尚、紹介状をお持ちの方は保険証と一緒に受付窓口にお出しください。<br></br>
      </Typography>
    </Box>
  );
}





