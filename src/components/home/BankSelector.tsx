import { MenuItem, Select, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { QuestionBank } from "../../utils/types";

interface BankSelectorProps {
  banks: QuestionBank[];
  value: string;
  onChange: (value: string) => void;
}

export default function BankSelector({
  banks,
  value,
  onChange,
}: BankSelectorProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t("home.bank")}
      </Typography>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        displayEmpty
        fullWidth
        sx={{ maxWidth: 400, mb: 3 }}
      >
        <MenuItem value="">{t("home.chooseBank")}</MenuItem>
        {banks.map((bank) => (
          <MenuItem key={bank.id} value={bank.id}>
            {bank.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
