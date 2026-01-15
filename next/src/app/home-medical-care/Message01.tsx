import { Box, Typography } from "@mui/material";

export default function Message02() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
        在宅医療とは？
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 4, }}>
        大切な家族の誰かが、病気になり通院できない場合に、病院でなく、自宅などで治療を<br></br>
        行うことが在宅医療であり、通常病院で行われる入院医療や外来医療に次ぐ第3の医療として、<br></br>
        多くの人に受け入れられるようになってきました。在宅医療は、医師をはじめ、歯科医師、<br></br>
        訪問看護師、薬剤師、栄養士、理学療法士、ケアマネジャー、ホームヘルパーなど多くの方々が<br></br>
        連携して定期的に患者さんのご自宅などを訪問し、チームとなって患者さんの治療やケアを24時間対応で行っていく医療活動です。<br></br>
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
        訪問診療と往診の違いは？
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 4, }}>
        往診とは、患者さん、ご家族からの要請で予定以外で訪問診療することをいいます。<br></br>
        これに対して、在宅医療を行なう患者さんで、疾病や傷病のため通院が困難な方に対し、<br></br>
        医師があらかじめ診療の計画を立て、患者さんの同意を得て定期的に（1か月に1回あるいは2回など）<br></br>
        患者さんの自宅などに赴いて行なう診療が「訪問診療」です。<br></br>
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
        在宅医療の医療費は？
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 4, }}>
        定期的な訪問診療にかかる費用の目安として、2週間に1度の訪問診療を実施した場合の基本料金<br></br>
        在宅患者訪問診療料 8,330円(1回) × 2回 + 在宅時医学総合管理料 38,000円(月1回) = 54,660円<br></br>
        3割負担の場合...16,400円<br></br>
        1割負担の場合...5,460円となります。<br></br>
        <br></br>
        上記の基本額に検査、処置、注射、お薬の費用がかかります。<br></br>
        （在宅診療を受けている場所が自宅か施設によって、金額は異る場合がございます）
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
        高額療養費制度とは？
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 4, }}>
        健康保険の毎月の自己負担金が一定以上になった場合、払い戻しが受けられます。<br></br>
        上限額は、年齢や所得、利用している健康保険の種類によっても異なりますので、<br></br>
        詳しくは、健康保険証に記載された問い合わせ先（保険者）に確認してください。<br></br>
        この払い戻しについては、自主的に申請することが必要です。<br></br>
      </Typography>
    </Box>
  );
}
