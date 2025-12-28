import RNDateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Button, ButtonText } from "./ui/button";
import { Heading } from "./ui/heading";
import { CloseIcon, Icon } from "./ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "./ui/modal";

interface IDatePickerModal {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function DatePickerModal({
  showModal,
  setShowModal,
  date,
  setDate,
}: IDatePickerModal) {
  const [selectedDate, setSelectedDate] = useState<Date>(date);

  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;

    setSelectedDate(selectedDate);
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
      }}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading className="text-typography-950" size="md">
            날짜 선택
          </Heading>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              className="stroke-background-400 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900 group-[:hover]/modal-close-button:stroke-background-700"
              size="md"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <RNDateTimePicker
            display="spinner"
            is24Hour={true}
            mode={"date"}
            onChange={onChange}
            testID="dateTimePicker"
            value={date}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            action="secondary"
            onPress={() => {
              setShowModal(false);
            }}
            variant="outline"
          >
            <ButtonText>취소</ButtonText>
          </Button>
          <Button
            onPress={() => {
              setDate(selectedDate);
              setShowModal(false);
            }}
          >
            <ButtonText>적용</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
