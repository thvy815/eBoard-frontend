"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Printer, List } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onPrintSummary: () => void;
  onPrintDetail: () => void;
}

export default function PrintOptionModal({
  open,
  onClose,
  onPrintSummary,
  onPrintDetail,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chọn chế độ in"
      description="Vui lòng chọn loại bảng điểm cần in"
      width="max-w-md"
    >
      <div className="space-y-3">
        <Button
          icon={Printer}
          className="w-full justify-start"
          onClick={() => {
            onClose();
            onPrintSummary();
          }}
        >
          In bảng điểm trung bình của lớp
        </Button>

        <Button
          icon={List}
          variant="outline"
          className="w-full justify-start"
          onClick={() => {
            onClose();
            onPrintDetail();
          }}
        >
          In hàng loạt bảng điểm chi tiết từng học sinh
        </Button>
      </div>
    </Modal>
  );
}
