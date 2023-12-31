import React, { useEffect, useState } from 'react';
import { useAppContext } from '~/contexts/appContext';
import type { SemesterPlan } from '~/interfaces/SemesterPlanData';
import { api } from '~/utils/api';
import { generateICal, downloadICal } from './GenerateIcal';
import GreenButton from '../../components/General/GreenButton';
import IcsCalendar from './IcsCalendar';
import { useLanguageContext } from '~/contexts/languageContext';

interface CalendarDisplayProps {
  subjectList: Array<string | undefined>;
}

const CalendarDisplay: React.FC<CalendarDisplayProps> = ({ subjectList }) => {
  const { season } = useAppContext();
  const [semesterPlans, setSemesterPlans] = useState<SemesterPlan[]>([]);
  const [ical, setIcal] = useState<string>("");
  const [indexes, setIndexes] = useState<Record<string, number>>({}); // Add this line

  const mutation = api.semesterPlan.getSemesterPlan.useMutation();
  const { language } = useLanguageContext();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const currentYearLastDigits = new Date().getFullYear().toString().slice(-2);
        const currentSemester = `${currentYearLastDigits}${season === 'Spring' ? 'v' : 'h'}`;

        const response = await mutation.mutateAsync({
          subjectCodes: subjectList.map(subjectCode => subjectCode ?? ''),
          semester: currentSemester,
        });

        if (isMounted) {
          setSemesterPlans(response);

          // Generate indexes based on subjectList
          const generatedIndexes: Record<string, number> = {};
          subjectList.forEach((subjectCode, index) => {
            if (subjectCode) {
              generatedIndexes[subjectCode] = index;
            }
          });
          setIndexes(generatedIndexes);
        }
      } catch (error) {
        console.error('Error fetching semester plans:', error);
      }
    };

    // Mark the promise as ignored using the 'void' operator
    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [subjectList, season]);

  useEffect(() => {
    const iCalContent = generateICal(semesterPlans);
    // teaching-method has a code for what it is it would seem
    setIcal(iCalContent);

  }, [semesterPlans]);

  const handleDownload = () => {
    downloadICal(ical, 'calendar.ics');
  };  
  
  const getDownloadLabel = (language: string) => {
    return language === "no" ? "Last ned ICS" : "Download ICS"
  }

  const getSaveLabel = (language: string) => {
    return language === "no" ? "Lagre på siden" : "Save on site"
  }

  return (
    <div>
      <GreenButton onClick={handleDownload} text={getDownloadLabel(language)}/>
      <GreenButton className='ml-4' onClick={handleDownload} text={getSaveLabel(language)}/>
      <div className='flex-column flex-row flex-shrink mt-2 mb-2 justify-center mx-auto '>
        {ical && <IcsCalendar icsFileContent={ical} indexes={indexes} />}
      </div>
    </div>
  );
};

export default CalendarDisplay;
