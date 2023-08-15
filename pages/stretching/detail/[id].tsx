import styled from "styled-components";
import { colors } from "../../../constants/style";
import ShadowBox from "../../../components/utils/ShadowBox";
import Typography from "../../../components/basic/Typography";
import Box from "../../../components/basic/Box";
import Navigator from "../../../components/utils/Navigator";
import Button from "../../../components/basic/Button";
import { useRouter } from "next/router";
import { useState } from "react";
import StretchingDetailView from "../../../views/stretchingDetailView";
import StretchingModifyView from "../../../views/stretchingModifyView";

const StretchingDetailPage = () => {
  const [modifyMode, setModifyMode] = useState<boolean>(false);

  const router = useRouter();

  const handleOnClickDeleteButton = () => {
    confirm("정말로 삭제하시겠습니까?");
  };

  return (
    <PageWrapper>
      <Navigator></Navigator>
      <ContentWrapper>
        <ShadowBox>
          <BreadCrumb>
            <Box display="flex" justifyContent="start" alignItems="center">
              <Typography variants="heading2">스트레칭</Typography>
              <Typography variants="heading2">{">"}</Typography>
              <Typography variants="heading2">상세</Typography>
            </Box>
            <Box width={80}>
              <Button
                size="xs"
                variants="secondary"
                onClick={() => router.push("/stretching")}
              >
                {"목록 >"}
              </Button>
            </Box>
          </BreadCrumb>
        </ShadowBox>
        <Box display="flex" justifyContent="end" alignItems="center" gap={8}>
          <Button
            width={80}
            size="xs"
            variants={!modifyMode ? "secondary" : "primary"}
            onClick={() => setModifyMode((prev) => !prev)}
          >
            {!modifyMode ? "수정" : "확인"}
          </Button>
          {!modifyMode && (
            <Button
              width={80}
              size="xs"
              variants="primary"
              onClick={handleOnClickDeleteButton}
            >
              삭제
            </Button>
          )}
        </Box>

        <ShadowBox>
          {/* <Box
            display="flex"
            flexDirection="column"
            gap={120}
            padding={32}
          ></Box> */}
          {!modifyMode ? (
            /*상세뷰*/
            <StretchingDetailView></StretchingDetailView>
          ) : (
            /*수정모드*/
            <StretchingModifyView></StretchingModifyView>
          )}
        </ShadowBox>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default StretchingDetailPage;

const PageWrapper = styled.div`
  display: flex;
  background-color: ${colors.f100};
  height: 100%;
`;

const ContentWrapper = styled.div`
  padding: 16px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const BreadCrumb = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 16px 16px 16px 32px;
`;