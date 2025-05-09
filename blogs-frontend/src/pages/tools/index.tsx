import { useEffect, useState, useRef } from "react";
import './index.css'

const LS_KEYS = {
  MONTHLY_SALARY: 'salaryCalculator_monthlySalary',
  WORK_DAYS_PER_MONTH: 'salaryCalculator_workDaysPerMonth',
  WORK_HOURS_PER_DAY: 'salaryCalculator_workHoursPerDay',
  WORK_START_TIME: 'salaryCalculator_workStartTime',
  WORK_END_TIME: 'salaryCalculator_workEndTime',
  LUNCH_BREAK_HOURS: 'salaryCalculator_lunchBreakHours',
};


const inputStyle = { padding: '5px', marginLeft: '5px', border: '1px solid #ccc', borderRadius: '4px',minWidth:'calc(100% - 160px)' };
const labelStyle = { display: 'inline-block', minWidth: '150px' }; // 给label一个最小宽度以对齐
const formRowStyle = { marginBottom: '15px' }; // 统一行间距

const AboutPage = () => {
  const getInitialState = <T,>(key: string, defaultValue: T): T => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      if (typeof defaultValue === 'number') {
        return Number(storedValue) as T;
      }
      return storedValue as T;
    }
    return defaultValue;
  };

  const [monthlySalary, setMonthlySalary] = useState<number>(
    getInitialState(LS_KEYS.MONTHLY_SALARY, 10000)
  );
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState<number>(
    getInitialState(LS_KEYS.WORK_DAYS_PER_MONTH, 22)
  );
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number>(
    getInitialState(LS_KEYS.WORK_HOURS_PER_DAY, 8)
  );
  const [accumulatedSalary, setAccumulatedSalary] = useState<number>(0);
  const [accumulatedDaily, setAccumulatedDaily] = useState<number>(0);
  const [remainingTimeToday, setRemainingTimeToday] = useState<string>("计算中...");
  const [isTodayCalculationComplete, setIsTodayCalculationComplete] = useState<boolean>(false);
  const [workStartTime, setWorkStartTime] = useState<string>(
    getInitialState(LS_KEYS.WORK_START_TIME, "09:00")
  );
  const [workEndTime, setWorkEndTime] = useState<string>(
    getInitialState(LS_KEYS.WORK_END_TIME, "18:00")
  );
  const [lunchBreakHours, setLunchBreakHours] = useState<number>(
    getInitialState(LS_KEYS.LUNCH_BREAK_HOURS, 1)
  );

  // 隐藏关键信息开关
  const [showSalary, setShowSalary] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Use ref for interval ID

  // Effect to save to localStorage whenever a relevant state changes
  useEffect(() => {
    localStorage.setItem(LS_KEYS.MONTHLY_SALARY, monthlySalary.toString());
  }, [monthlySalary]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.WORK_DAYS_PER_MONTH, workDaysPerMonth.toString());
  }, [workDaysPerMonth]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.WORK_HOURS_PER_DAY, workHoursPerDay.toString());
  }, [workHoursPerDay]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.WORK_START_TIME, workStartTime);
  }, [workStartTime]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.WORK_END_TIME, workEndTime);
  }, [workEndTime]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.LUNCH_BREAK_HOURS, lunchBreakHours.toString());
  }, [lunchBreakHours]);

  // Function to clear existing interval
  const clearIntervalIfNeeded = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const calculateSalary = () => {
      if (monthlySalary <= 0 || workDaysPerMonth <= 0 || workHoursPerDay <= 0) {
        setAccumulatedSalary(0);
        setRemainingTimeToday("请输入有效的工资参数");
        setIsTodayCalculationComplete(true);
        return;
      }

      const now = new Date();
      const currentDayOfMonth = now.getDate();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      const [startHour, startMinute] = workStartTime.split(':').map(Number);
      const [endHour, endMinute] = workEndTime.split(':').map(Number);

      const dailyEffectiveWorkSeconds = (workHoursPerDay - lunchBreakHours) * 60 * 60;
      if (dailyEffectiveWorkSeconds <= 0) {
        setAccumulatedSalary(0);
        setRemainingTimeToday("每日有效工时需大于0小时");
        setIsTodayCalculationComplete(true);
        return;
      }
      const salaryPerSecond = monthlySalary / workDaysPerMonth / dailyEffectiveWorkSeconds;

      let todayEarnedSeconds = 0;
      const currentTimeInSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;
      const workStartTimeInSeconds = startHour * 3600 + startMinute * 60;
      const workEndTimeInSeconds = endHour * 3600 + endMinute * 60;
      const lunchBreakStartHour = 12; 
      const lunchBreakEndHour = lunchBreakStartHour + lunchBreakHours;
      const lunchBreakStartInSeconds = lunchBreakStartHour * 3600;
      const lunchBreakEndInSeconds = lunchBreakEndHour * 3600;

      if (currentTimeInSeconds >= workStartTimeInSeconds && currentTimeInSeconds < workEndTimeInSeconds) {
        let workedSecondsToday = currentTimeInSeconds - workStartTimeInSeconds;
        
        if (currentTimeInSeconds > lunchBreakEndInSeconds) { 
          workedSecondsToday -= lunchBreakHours * 3600;
        } else if (currentTimeInSeconds > lunchBreakStartInSeconds && currentTimeInSeconds <= lunchBreakEndInSeconds) { 
          workedSecondsToday -= (currentTimeInSeconds - lunchBreakStartInSeconds);
        }
        todayEarnedSeconds = Math.max(0, workedSecondsToday);
        todayEarnedSeconds = Math.min(todayEarnedSeconds, dailyEffectiveWorkSeconds); 
      } else if (currentTimeInSeconds >= workEndTimeInSeconds) {
        todayEarnedSeconds = dailyEffectiveWorkSeconds; 
      }
      
      const passedWorkDays = Math.min(currentDayOfMonth -1, workDaysPerMonth); 
      const totalEarned = (passedWorkDays * dailyEffectiveWorkSeconds + todayEarnedSeconds) * salaryPerSecond;
      setAccumulatedSalary(totalEarned);

      const remainingSecondsForToday = dailyEffectiveWorkSeconds - todayEarnedSeconds;

      if (currentTimeInSeconds < workStartTimeInSeconds) {
        setRemainingTimeToday("尚未开始工作");
        setIsTodayCalculationComplete(false); // Reset for next day or if params change before work
      } else if (remainingSecondsForToday <= 0) {
        setRemainingTimeToday("今日KPI已达成！摸鱼时刻！");
        setIsTodayCalculationComplete(true);
      } else {
        const hours = Math.floor(remainingSecondsForToday / 3600);
        const minutes = Math.floor((remainingSecondsForToday % 3600) / 60);
        const seconds = Math.floor(remainingSecondsForToday % 60);
        setRemainingTimeToday(`${hours}小时 ${minutes}分钟 ${seconds}秒`);
        setIsTodayCalculationComplete(false);
      }
    };

    // Clear previous interval before setting a new one or if calculation is complete
    clearIntervalIfNeeded();

    if (isTodayCalculationComplete) {
      calculateSalary(); // Run once to display final state if params changed to complete
    } else {
      calculateSalary(); // Initial calculation
      intervalRef.current = setInterval(calculateSalary, 1000); 
    }

    return () => clearIntervalIfNeeded(); // Cleanup on unmount or when dependencies change
  }, [monthlySalary, workDaysPerMonth, workHoursPerDay, workStartTime, workEndTime, lunchBreakHours, isTodayCalculationComplete]);

  useEffect(() => {
    setAccumulatedDaily(monthlySalary / workDaysPerMonth)
  },[monthlySalary,workDaysPerMonth,])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{fontSize:24, textAlign: 'center', color: '#1a73e8', marginBottom: '25px'}}>牛马粮食计算器</h1>
      <div style={{marginBottom:10}}>
      <label htmlFor="monthlySalary" style={labelStyle}>关键信息是否展示: </label> 
      <label className="switch">
        <input type="checkbox" onChange={(e) => {setShowSalary(e.target.checked)}}/>
        <span className="slider"></span>
      </label>
      
      </div>
      <div style={formRowStyle}> 
        <label htmlFor="monthlySalary" style={labelStyle}>月薪 (元): </label>
        <input 
          type={showSalary?'number':'password'}
          id="monthlySalary" 
          value={monthlySalary}
          onChange={(e) => setMonthlySalary(Number(e.target.value))}
          style={inputStyle}
        />
      </div>
      <div style={formRowStyle}>
        <label htmlFor="workDaysPerMonth" style={labelStyle}>每月工作天数: </label>
        <input 
          type="number" 
          id="workDaysPerMonth" 
          value={workDaysPerMonth}
          onChange={(e) => setWorkDaysPerMonth(Number(e.target.value))}
          style={inputStyle}
        />
      </div>
      <div style={formRowStyle}>
        <label htmlFor="workHoursPerDay" style={labelStyle}>每日名义工作小时: </label>
        <input 
          type="number" 
          id="workHoursPerDay" 
          value={workHoursPerDay}
          onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
          style={inputStyle}
        />
      </div>
      <div style={formRowStyle}>
        <label htmlFor="workStartTime" style={labelStyle}>上班时间 (HH:MM): </label>
        <input 
          type="time" 
          id="workStartTime" 
          value={workStartTime}
          onChange={(e) => setWorkStartTime(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={formRowStyle}>
        <label htmlFor="workEndTime" style={labelStyle}>下班时间 (HH:MM): </label>
        <input 
          type="time" 
          id="workEndTime" 
          value={workEndTime}
          onChange={(e) => setWorkEndTime(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={formRowStyle}>
        <label htmlFor="lunchBreakHours" style={labelStyle}>午休小时数: </label>
        <input 
          type="number" 
          id="lunchBreakHours" 
          value={lunchBreakHours}
          min="0"
          step="0.5"
          onChange={(e) => setLunchBreakHours(Number(e.target.value))}
          style={inputStyle}
        />
      </div>

      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <h3 style={{ fontSize: '18px', color: '#555' }}>
          您当月的日薪: <span style={{ color: 'green',fontWeight:700,fontSize:20 }}>{showSalary ? accumulatedDaily.toFixed(2) :'***'}</span> 元
        </h3>
        <h3 style={{ fontSize: '18px', color: '#555' }}>
          您目前已挣得: <span style={{ color: 'green',fontWeight:700,fontSize:20 }}>{showSalary ? accumulatedSalary.toFixed(2):'***'}</span> 元
        </h3>
        <h3 style={{ fontSize: '18px', color: '#555' }}>
          今天还需 <span style={{ color: 'orange', fontWeight:700, fontSize:20 }}>{remainingTimeToday}</span> 即可完成任务
        </h3>
      </div>

      {isTodayCalculationComplete && (
        <p style={{ color: 'blue', marginTop: '20px', fontSize: '1em', textAlign: 'center', backgroundColor: '#e6f7ff', padding: '10px', borderRadius: '4px' }}>
          提示：今日工资已计算完毕，计时器已停止。若要重新计算，请修改上方参数。
        </p>
      )}
    </div>
  );
};

export default AboutPage;
