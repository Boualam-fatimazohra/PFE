// src/components/formation-modal/sections/DateSelectionSection.tsx
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";

interface DateSelectionSectionProps {
  dateDebut: Date | null;
  setDateDebut: React.Dispatch<React.SetStateAction<Date | null>>;
  dateFin: Date | null;
  setDateFin: React.Dispatch<React.SetStateAction<Date | null>>;
  errors: Record<string, string>;
  GlobalStyle: any;
}

const DateSelectionSection: React.FC<DateSelectionSectionProps> = ({
  dateDebut,
  setDateDebut,
  dateFin,
  setDateFin,
  errors,
  GlobalStyle
}) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div>
        <label className="rounded-none block text-sm font-bold text-black mb-1">
          Date début formation <span className="text-red-500">*</span>
        </label>
        <div className="relative w-full">
          <>
            <GlobalStyle />
            <DatePicker
              selected={dateDebut}
              onChange={(date) => setDateDebut(date)}
              locale={fr}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="jj/mm/aaaa"
              className={`rounded-none w-full p-2.5 border ${dateDebut ? 'border-gray-300' : 'border-gray-300'} rounded-lg`}
              calendarClassName="custom-calendar"
              popperClassName="custom-popper"
              wrapperClassName="w-full"
              timeCaption="Heure"
            />
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8306 6.33861C14.8303 5.8435 15.0633 5.37732 15.4594 5.08056V6.33861C15.4594 6.85963 15.882 7.28223 16.4031 7.28223C16.9244 7.28223 17.347 6.85963 17.347 6.33861L17.3467 6.02418H17.347V5.09305C17.7425 5.38464 17.9758 5.84715 17.9758 6.33861C17.9758 7.20728 17.2717 7.91111 16.4031 7.91111C15.535 7.91111 14.8306 7.20728 14.8306 6.33861ZM6.02415 6.33861C6.02385 5.8435 6.25693 5.37732 6.65303 5.08056V6.33861C6.65303 6.85963 7.07563 7.28223 7.59695 7.28223C8.11797 7.28223 8.54026 6.85963 8.54026 6.33861V6.02418H8.54057V5.08086C9.23525 5.60188 9.37602 6.58754 8.8547 7.28254C8.33338 7.97692 7.34741 8.11768 6.65303 7.59636C6.25693 7.29929 6.02415 6.83343 6.02415 6.33861ZM20.4919 20.4919H4.45164C3.93063 20.4919 3.50803 20.0693 3.50803 19.5483V9.79831H19.5483C20.0693 9.79831 20.4919 10.2206 20.4919 10.7419V20.4919ZM19.8631 4.13693H17.347V3.18082C17.347 2.6598 16.9244 2.25 16.403 2.25C15.882 2.25 15.4594 2.6723 15.4594 3.19331V4.13693H8.54058L8.54027 3.19331C8.54027 2.6723 8.11798 2.25 7.59696 2.25C7.07564 2.25 6.65304 2.6723 6.65304 3.19331V4.13693H2.25V19.8628C2.25 20.9051 3.09459 21.75 4.13693 21.75H21.75V6.02416C21.75 4.98183 20.9051 4.13693 19.8631 4.13693Z" fill="#F16E00"/>
              </svg>
            </div>
          </>
        </div>
        {errors?.dateDebut && <p className="mt-1 text-sm text-red-500">{errors.dateDebut}</p>}
      </div>
      <div>
        <label className="block text-sm font-bold text-black mb-1">
          Date fin formation<span className="text-red-500">*</span>
        </label>
        <div className="relative w-full">
          <>
            <GlobalStyle />
            <DatePicker
              selected={dateFin}
              onChange={(date) => setDateFin(date)}
              locale={fr}
              showTimeSelect
              dateFormat="d MMMM yyyy - HH:mm"
              placeholderText="jj/mm/aaaa"
              className="rounded-none w-full p-2.5 border border-gray-300 rounded-lg pr-10"
              calendarClassName="custom-calendar"
              popperClassName="custom-popper"
              wrapperClassName="w-full"
              timeCaption="Heure"
            />
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8306 6.33861C14.8303 5.8435 15.0633 5.37732 15.4594 5.08056V6.33861C15.4594 6.85963 15.882 7.28223 16.4031 7.28223C16.9244 7.28223 17.347 6.85963 17.347 6.33861L17.3467 6.02418H17.347V5.09305C17.7425 5.38464 17.9758 5.84715 17.9758 6.33861C17.9758 7.20728 17.2717 7.91111 16.4031 7.91111C15.535 7.91111 14.8306 7.20728 14.8306 6.33861ZM6.02415 6.33861C6.02385 5.8435 6.25693 5.37732 6.65303 5.08056V6.33861C6.65303 6.85963 7.07563 7.28223 7.59695 7.28223C8.11797 7.28223 8.54026 6.85963 8.54026 6.33861V6.02418H8.54057V5.08086C9.23525 5.60188 9.37602 6.58754 8.8547 7.28254C8.33338 7.97692 7.34741 8.11768 6.65303 7.59636C6.25693 7.29929 6.02415 6.83343 6.02415 6.33861ZM20.4919 20.4919H4.45164C3.93063 20.4919 3.50803 20.0693 3.50803 19.5483V9.79831H19.5483C20.0693 9.79831 20.4919 10.2206 20.4919 10.7419V20.4919ZM19.8631 4.13693H17.347V3.18082C17.347 2.6598 16.9244 2.25 16.403 2.25C15.882 2.25 15.4594 2.6723 15.4594 3.19331V4.13693H8.54058L8.54027 3.19331C8.54027 2.6723 8.11798 2.25 7.59696 2.25C7.07564 2.25 6.65304 2.6723 6.65304 3.19331V4.13693H2.25V19.8628C2.25 20.9051 3.09459 21.75 4.13693 21.75H21.75V6.02416C21.75 4.98183 20.9051 4.13693 19.8631 4.13693Z" fill="#F16E00"/>
              </svg>
            </div>
          </>
        </div>
        {errors?.dateFin && <p className="mt-1 text-sm text-red-500">{errors.dateFin}</p>}
      </div>
    </div>
  );
};

export default DateSelectionSection;