import type * as ImagePicker from "expo-image-picker";

import { useAtomValue } from "jotai/react";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { userAtom } from "@/atoms/userAtom";
import DogBreedActionsheet from "@/components/actionsheet/DogBreedActionsheet";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import HeaderBar from "@/components/HeaderBar";
import DatePicker from "@/components/molecules/DatePicker";
import DogImagePicker from "@/components/molecules/DogImagePicker";
import SectionTitle from "@/components/SectionTitle";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { CircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { dogGender } from "@/constants/DogBreeds";
import { useRegisterDog } from "@/hooks/useRegisterDog";

export default function DogRegisterScreen() {
  const [dogImage, setDogImage] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogGenderValue, setDogGenderValue] = useState("MALE");
  const [dogBirth, setDogBirth] = useState(new Date());

  const [showDogBreedActionsheet, setShowDogBreedActionsheet] = useState(false);

  const userInfo = useAtomValue(userAtom);

  const { handleRegister } = useRegisterDog();

  const isRegister = useMemo(() => {
    return (
      dogImage.length > 0 && dogName.trim().length > 0 && dogBreed && !!dogBirth
    );
  }, [dogImage, dogName, dogBreed, dogBirth]);

  return (
    <CustomSafeAreaView>
      <HeaderBar isShowBackButton={true} title={"반려견 등록"} />
      <ScrollView className="flex-1">
        <VStack className="p-6">
          {/* NOTE: 반려견 사진 등록 */}
          <VStack className="items-center gap-4">
            <DogImagePicker dogImage={dogImage} setDogImage={setDogImage} />
            <Text className="text-slate-500" size="sm">
              반려견 사진을 등록해주세요
            </Text>
          </VStack>

          {/* NOTE: 반려견 이름 입력 */}
          <SectionTitle title={"이름"}>
            <Input>
              <InputField
                onChangeText={(text) => setDogName(text)}
                placeholder="반려견 이름을 입력해주세요"
                value={dogName}
              />
            </Input>
          </SectionTitle>

          {/* NOTE: 견종 선택 */}
          <SectionTitle title={"견종"}>
            <Button
              action={dogBreed ? "secondary" : "primary"}
              className={dogBreed ? "justify-start" : "justify-center"}
              onPress={() => {
                setShowDogBreedActionsheet(true);
              }}
              variant="outline"
            >
              <ButtonText>{dogBreed ? dogBreed : "선택하기"}</ButtonText>
            </Button>
          </SectionTitle>

          {/* NOTE: 성별 선택 */}
          <SectionTitle title={"성별"}>
            <RadioGroup
              onChange={(isSelected) => setDogGenderValue(isSelected)}
              value={dogGenderValue}
            >
              <HStack space="2xl">
                {dogGender.map((data) => (
                  <Radio key={`dog_gender_${data.value}`} value={data.value}>
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>{data.label}</RadioLabel>
                  </Radio>
                ))}
              </HStack>
            </RadioGroup>
          </SectionTitle>

          {/* NOTE: 생년월일 선택 */}
          <SectionTitle title={"생년월일"}>
            <DatePicker date={dogBirth} setDate={setDogBirth} />
          </SectionTitle>
        </VStack>
      </ScrollView>
      <View className="p-6">
        <Button
          isDisabled={!isRegister}
          onPress={() => {
            handleRegister({
              dogImage,
              userId: userInfo.id,
              name: dogName,
              breed: dogBreed,
              gender: dogGenderValue,
              birthdate: dogBirth,
            });
          }}
        >
          <ButtonText>등록하기</ButtonText>
        </Button>
      </View>
      <DogBreedActionsheet
        dogBreed={dogBreed}
        setDogBreed={setDogBreed}
        setShowActionsheet={setShowDogBreedActionsheet}
        showActionsheet={showDogBreedActionsheet}
      />
    </CustomSafeAreaView>
  );
}
