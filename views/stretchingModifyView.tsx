import React, { Dispatch, useEffect, useMemo, useRef } from "react";
import { FiLink2 } from "react-icons/fi";
import Box from "../components/basic/Box";
import Button from "../components/basic/Button";
import ComboBox from "../components/basic/ComboBox";
import Input from "../components/basic/Input";
import Typography from "../components/basic/Typography";
import InputTableItem from "../components/utils/InputTableItem";
import SubTitle from "../components/utils/SubTitle";
import { colors } from "../constants/style";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  STRETCHING_MAIN_CATEGORY,
  LOWER_BODY_CATEGORY,
  UPPER_BODY_CATEGORY,
  EFFECT_CATEGORY,
  IComboBoxType,
} from "../constants";
import {
  StretchingMainCategoryType,
  StretchingSubCategoryType,
} from "../constants/types";
import { IDetailData } from "./stretchingDetailView";
import {
  STRETCHING_EFFECT_TEXT,
  STRETCHING_MAIN_CATEGORY_TEXT,
  STRETCHING_SUB_CATEGORY_TEXT,
} from "../constants/text";
import useListModify from "../hooks/use-list-modiy";
import { IFormatedData } from "../pages/stretching/post";
import styled from "styled-components";
import ImageItem from "../components/utils/ImageWrapper";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import useImageUpload from "../hooks/use-image-upload";

interface IProps {
  data: IDetailData;
}

const StretchingModifyView = (props: IProps) => {
  const { data } = props;
  const [inputValue, setInputValue] = useState(data.title);
  const [mainCategoryValue, setMainCategoryValue] = useState<
    IComboBoxType<StretchingMainCategoryType>
  >({
    id: data.mainCategory,
    name: STRETCHING_MAIN_CATEGORY_TEXT[data.mainCategory],
  });
  const [subCategoryValue, setSubCategoryValue] = useState<
    IComboBoxType<StretchingSubCategoryType>
  >({
    id: data.subCategory,
    name: STRETCHING_SUB_CATEGORY_TEXT[data.subCategory],
  });
  const [effectValue1, setEffectValue1] = useState({
    id: data.effectList[0],
    name: STRETCHING_EFFECT_TEXT[data.effectList[0]],
  });
  const [effectValue2, setEffectValue2] = useState({
    id: data.effectList[1],
    name: STRETCHING_EFFECT_TEXT[data.effectList[1]],
  });
  const [effectValue3, setEffectValue3] = useState({
    id: data.effectList[2],
    name: STRETCHING_EFFECT_TEXT[data.effectList[2]],
  });
  const [videoLink, setVideoLink] = useState(data.videoUrl);
  const [preferTimeValue, setPreferTimeValue] = useState<number>(data.collect);
  const [preferSetValue, setPreferSetValue] = useState<number>(data.set);
  const techniqueList = useMemo(
    () =>
      data.techniqueList.map((item, index) => ({
        order: index + 1,
        detail: item,
      })),
    [data]
  );

  const precautionList = useMemo(
    () =>
      data.precautionList.map((item, index) => ({
        order: index + 1,
        detail: item,
      })),
    [data]
  );

  const imageInput = useRef();
  const [stretchingOrder, setStretchingOrder] =
    useState<{ order: number; detail: string }[]>(techniqueList);
  const [isStretchingOrderDeleteMode, setIsStretchingOrderDeleteMode] =
    useState<boolean>(false);
  const [stretchingOrderDeletelist, setStretchingOrderDeletelist] = useState(
    []
  );

  const [cautionOrder, setCautionOrder] =
    useState<{ order: number; detail: string }[]>(precautionList);
  const [isCautionOrderDeleteMode, setIsCautionOrderDeleteMode] =
    useState<boolean>(false);
  const [cautionOrderDeletelist, setCautionOrderDeletelist] = useState<
    number[] | undefined
  >([]);

  const [imageFormData, setImageFormData] = useState<any[]>([
    ...data.imageList,
  ]);
  const [previewFile, setPreviewFile] = useState<any[]>([...data.imageList]);

  const [isRendered, setIsRendered] = useState(false);
  useEffect(() => {
    setIsRendered(true);
  }, []);

  const { mutateAsync: modiyList } = useListModify();
  const { mutateAsync: uploadImage } = useImageUpload();

  const router = useRouter();

  const handleOnDragEnd = (e) => {
    const currentIndex = e.source?.index;
    const destinationIndex = e.destination?.index;
    setPreviewFile((prev) => {
      if (currentIndex <= destinationIndex) {
        prev.splice(destinationIndex + 1, 0, prev[currentIndex]);
        prev.splice(currentIndex, 1);
        return [...prev];
      } else {
        prev.splice(destinationIndex - 1, 0, prev[currentIndex]);
        prev.splice(currentIndex + 1, 1);
        return [...prev];
      }
    });

    setImageFormData((prev) => {
      if (currentIndex <= destinationIndex) {
        prev.splice(destinationIndex + 1, 0, prev[currentIndex]);
        prev.splice(currentIndex, 1);
        return [...prev];
      } else {
        prev.splice(destinationIndex - 1, 0, prev[currentIndex]);
        prev.splice(currentIndex + 1, 1);
        return [...prev];
      }
    });
  };

  const handleOnClickImageUploadButton = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => setPreviewFile((prev) => [...prev, reader.result]);
    setImageFormData((prev) => [...prev, formData]);
  };

  const handleOnClickModifyButton = async () => {
    let filePathsArray = [];

    if (imageFormData.length > 0) {
      await Promise.all(
        imageFormData.map((imageList) => {
          if (typeof imageList === "string") {
            filePathsArray.push(imageList);
          } else {
            return uploadImage(imageList).then((res) =>
              filePathsArray.push(res.filePath)
            );
          }
        })
      ).then(() => {
        const formattedData: IFormatedData = {
          title: inputValue,
          mainCategory: mainCategoryValue.id,
          subCategory: subCategoryValue.id,
          effectList: [effectValue1.id, effectValue2.id, effectValue3.id],
          imageList: [...filePathsArray],
          techniqueList: [...stretchingOrder.map((list) => list.detail)],
          collect: Number(preferTimeValue),
          set: Number(preferSetValue),
          precautionList: [...cautionOrder.map((list) => list.detail)],
          videoUrl: videoLink,
        };

        modiyList({ pageId: Number(data.id), formattedData }).then(() =>
          router.reload()
        );
      });
    }
  };

  const handleOnClickDeleteStretchingOrder = (order: number) => {
    if (stretchingOrderDeletelist.includes(order)) {
      setStretchingOrderDeletelist((prev) =>
        prev.filter((item) => item !== order)
      );
    } else {
      setStretchingOrderDeletelist((prev) => [...prev, order]);
    }
  };

  const handleOnClickStretchingDeleteButton = () => {
    setIsStretchingOrderDeleteMode((prev) => !prev);

    if (isStretchingOrderDeleteMode && stretchingOrder.length > 1) {
      let restArray = [...stretchingOrder].filter(
        (orderList) =>
          orderList.order !==
          [...stretchingOrderDeletelist].filter(
            (deleteOrder) => deleteOrder === orderList.order
          )[0]
      );
      restArray.map((list, index) => (list.order = index + 1));
      setStretchingOrder([...restArray]);
    }
  };

  const handleOnClickDeleteCautionOrder = (order: number) => {
    if (cautionOrderDeletelist.includes(order)) {
      setCautionOrderDeletelist((prev) =>
        prev.filter((item) => item !== order)
      );
    } else {
      setCautionOrderDeletelist((prev) => [...prev, order]);
    }
  };

  const handleOnClickCautionDeleteButton = () => {
    setIsCautionOrderDeleteMode((prev) => !prev);

    if (isCautionOrderDeleteMode) {
      let restArray = [...cautionOrder].filter(
        (orderList) =>
          orderList.order !==
          [...cautionOrderDeletelist].filter(
            (deleteOrder) => deleteOrder === orderList.order
          )[0]
      );
      restArray.map((list, index) => (list.order = index + 1));
      setCautionOrder([...restArray]);
    }
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Box display="flex" flexDirection="column" gap={120} padding={32}>
        <Box gap={24} display="flex" flexDirection="column" width={"100%"}>
          <Box display="flex" justifyContent="end" alignItems="center" gap={8}>
            <Button
              width={80}
              size="xs"
              variants={"primary"}
              onClick={handleOnClickModifyButton}
            >
              수정 완료
            </Button>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={16}
            justifyContent="start"
            width={"100%"}
          >
            <SubTitle required>제목</SubTitle>
            <Input
              value={inputValue}
              setValue={(e) => setInputValue(e.target.value)}
            ></Input>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={16}
            justifyContent="start"
            width={"100%"}
          >
            <SubTitle required>부위</SubTitle>
            <Box
              display="flex"
              justifyContent="start"
              alignItems="start"
              gap={8}
            >
              <ComboBox
                size="sm"
                list={STRETCHING_MAIN_CATEGORY}
                value={mainCategoryValue}
                setValue={setMainCategoryValue}
                label="대분류"
              ></ComboBox>
              <ComboBox
                size="sm"
                disabled={!mainCategoryValue}
                list={
                  mainCategoryValue?.id === "UPPER_BODY"
                    ? UPPER_BODY_CATEGORY
                    : LOWER_BODY_CATEGORY
                }
                value={subCategoryValue}
                setValue={setSubCategoryValue}
                label="중분류"
              ></ComboBox>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={16}
            justifyContent="start"
            width={"100%"}
          >
            <SubTitle caption="＊효과1 선택필수">효과</SubTitle>
            <Box
              display="flex"
              justifyContent="start"
              alignItems="start"
              gap={8}
            >
              <ComboBox
                size="sm"
                list={EFFECT_CATEGORY}
                value={effectValue1}
                setValue={setEffectValue1}
                label="효과1"
              ></ComboBox>
              <ComboBox
                size="sm"
                list={EFFECT_CATEGORY}
                value={effectValue2}
                setValue={setEffectValue2}
                label="효과2"
              ></ComboBox>
              <ComboBox
                size="sm"
                list={EFFECT_CATEGORY}
                value={effectValue3}
                setValue={setEffectValue3}
                label="효과3"
              ></ComboBox>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={16}
            justifyContent="start"
            width={"100%"}
          >
            <SubTitle required>이미지</SubTitle>
            {isRendered && (
              <Droppable droppableId="post-image-modify">
                {(provided) => (
                  <DropBox
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    onDragEnd={handleOnDragEnd}
                  >
                    {previewFile &&
                      previewFile.length > 0 &&
                      previewFile.map((imageUrl, idx) => (
                        <ImageItem
                          key={`upload-img-${imageUrl}`}
                          imageUrl={imageUrl}
                          idx={idx}
                          setImageFormatData={setImageFormData}
                          setPreviewFile={setPreviewFile}
                        ></ImageItem>
                      ))}
                  </DropBox>
                )}
              </Droppable>
            )}
            <Box width={80}>
              <ImageUploadButton htmlFor="image-upload">
                +추가
              </ImageUploadButton>
              <input
                type="file"
                ref={imageInput}
                id="image-upload"
                onChange={handleOnClickImageUploadButton}
                style={{ display: "none" }}
              ></input>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={16}
            justifyContent="start"
            width={"100%"}
            height={"100%"}
          >
            <SubTitle required>스트레칭 방법 및 순서</SubTitle>
            <Box
              border={` 1px solid ${colors.g000}`}
              display="flex"
              flexDirection="column"
              borderRadius={8}
              overflow="hidden"
              gap={1}
              backgroundColor={colors.g000}
            >
              {stretchingOrder.map((item) => (
                <InputTableItem
                  order={item.order}
                  key={`stretching-oreder-${item.order}`}
                  deleteMode={isStretchingOrderDeleteMode}
                  onClickDelete={handleOnClickDeleteStretchingOrder}
                >
                  <Input
                    value={item.detail}
                    setValue={(e) =>
                      setStretchingOrder((prev) =>
                        prev.map((prevItem) =>
                          prevItem.order === item.order
                            ? { ...prevItem, detail: e.target.value }
                            : prevItem
                        )
                      )
                    }
                    invisible
                  ></Input>
                </InputTableItem>
              ))}
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="start"
              gap={4}
            >
              {!isStretchingOrderDeleteMode && (
                <Box width={80}>
                  <Button
                    size="xs"
                    variants="secondary"
                    onClick={() =>
                      setStretchingOrder((prev) => [
                        ...prev,
                        { order: prev.at(-1).order + 1, detail: "" },
                      ])
                    }
                  >
                    +추가
                  </Button>
                </Box>
              )}
              <Box width={80}>
                <Button
                  size="xs"
                  variants="primary"
                  onClick={handleOnClickStretchingDeleteButton}
                >
                  {isStretchingOrderDeleteMode ? "확인" : "삭제"}
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={16}
            justifyContent="start"
            width={"100%"}
          >
            <SubTitle required>권장 횟수</SubTitle>
            <Box
              display="flex"
              justifyContent="start"
              alignItems="center"
              gap={8}
            >
              <Box
                display="flex"
                justifyContent="start"
                alignItems="center"
                gap={8}
              >
                <Box width={120}>
                  <Input
                    value={preferTimeValue}
                    setValue={setPreferTimeValue}
                  ></Input>
                </Box>
                <Typography variants="body1">회</Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="start"
                alignItems="center"
                gap={8}
              >
                <Box width={120}>
                  <Input
                    value={preferSetValue}
                    setValue={setPreferSetValue}
                  ></Input>
                </Box>
                <Typography variants="body1">세트</Typography>
              </Box>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={16}
            justifyContent="start"
            width={"100%"}
          >
            <SubTitle>주의할 점</SubTitle>
            {cautionOrder.length > 0 && (
              <Box
                border={` 1px solid ${colors.g000}`}
                display="flex"
                flexDirection="column"
                borderRadius={8}
                overflow="hidden"
                gap={1}
                backgroundColor={colors.g000}
              >
                {cautionOrder.map((item) => (
                  <InputTableItem
                    order={item.order}
                    key={`caution-oreder-${item.order}`}
                    deleteMode={isCautionOrderDeleteMode}
                    onClickDelete={handleOnClickDeleteCautionOrder}
                  >
                    <Input
                      value={item.detail}
                      setValue={(e) =>
                        setCautionOrder((prev) =>
                          prev.map((prevItem) =>
                            prevItem.order === item.order
                              ? { ...prevItem, detail: e.target.value }
                              : prevItem
                          )
                        )
                      }
                      invisible
                    ></Input>
                  </InputTableItem>
                ))}
              </Box>
            )}
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="start"
              gap={4}
            >
              {!isCautionOrderDeleteMode && (
                <Box width={80}>
                  <Button
                    size="xs"
                    variants="secondary"
                    onClick={() =>
                      setCautionOrder((prev) => [
                        ...prev,
                        {
                          order: prev.at(-1) ? prev.at(-1).order + 1 : 1,
                          detail: "",
                        },
                      ])
                    }
                  >
                    +추가
                  </Button>
                </Box>
              )}
              <Box width={80}>
                <Button
                  size="xs"
                  variants="primary"
                  onClick={handleOnClickCautionDeleteButton}
                >
                  {isCautionOrderDeleteMode ? "확인" : "삭제"}
                </Button>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap={16}
              justifyContent="start"
              width={"100%"}
            >
              <SubTitle>참고영상 링크</SubTitle>
              <Box
                display="flex"
                justifyContent="start"
                alignItems="center"
                gap={8}
              >
                <FiLink2></FiLink2>
                <Box width={"100%"}>
                  <Input
                    value={videoLink}
                    setValue={(e) => setVideoLink(e.target.value)}
                  ></Input>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </DragDropContext>
  );
};

export default StretchingModifyView;

const DropBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 350px);
  gap: 16px;
`;
const ImageUploadButton = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  width: 80px;
  font-size: 12px;
  color: ${colors.vividPrimaryColor};
  border: 2px solid ${colors.vividPrimaryColor};
  border-radius: 8px;
  font-weight: 700;
`;
