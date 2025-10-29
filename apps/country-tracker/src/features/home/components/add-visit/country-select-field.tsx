import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { addVisitFormOptions } from "@/features/home/constants/add-visit-form";
import {
  COUNTRY_OPTION_MAP,
  COUNTRY_OPTIONS,
} from "@/features/home/utils/country-options";
import { withForm } from "@/hooks/create-app-form";
import i18n from "@/libs/i18n";

export const CountrySelectField = withForm({
  ...addVisitFormOptions,
  render: ({ form }) => (
    <form.AppField name="selectedCountry">
      {(field) => {
        const selectedCountry = field.state.value ?? null;
        const selectedOption = selectedCountry
          ? COUNTRY_OPTION_MAP.get(selectedCountry)
          : undefined;
        const selectedDisplayValue = selectedOption
          ? `${selectedOption.flag} ${selectedOption.label}`
          : "";

        return (
          <FormControl className="gap-2" size="lg">
            <FormControlLabel>
              <FormControlLabelText className="text-sm">
                {i18n.t("home.add-visit.country-label") ?? ""}
              </FormControlLabelText>
            </FormControlLabel>
            <Select
              onValueChange={(country) => field.setValue(country)}
              selectedValue={selectedCountry ?? undefined}
            >
              <SelectTrigger
                className="rounded-2xl border bg-background-50"
                size="lg"
                variant="outline"
              >
                <SelectInput
                  editable={false}
                  placeholder={
                    i18n.t("home.add-visit.country-placeholder") ?? ""
                  }
                  value={selectedDisplayValue}
                />
                <SelectIcon className="mr-2" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  {COUNTRY_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.code}
                      label={`${option.flag} ${option.label}`}
                      value={option.code}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
            <FormControlHelper>
              <FormControlHelperText size="xs">
                {i18n.t("home.add-visit.country-helper") ?? ""}
              </FormControlHelperText>
            </FormControlHelper>
          </FormControl>
        );
      }}
    </form.AppField>
  ),
});
