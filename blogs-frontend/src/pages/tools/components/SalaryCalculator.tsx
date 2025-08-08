import { useEffect, useState, useRef } from "react";

const LS_KEYS = {
  MONTHLY_SALARY: 'salaryCalculator_monthlySalary',
  WORK_DAYS_PER_MONTH: 'salaryCalculator_workDaysPerMonth',
  WORK_HOURS_PER_DAY: 'salaryCalculator_workHoursPerDay',
  WORK_START_TIME: 'salaryCalculator_workStartTime',
  WORK_END_TIME: 'salaryCalculator_workEndTime',
  LUNCH_BREAK_HOURS: 'salaryCalculator_lunchBreakHours',
};

const SalaryCalculator = () => {
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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
        setIsTodayCalculationComplete(false);
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

    clearIntervalIfNeeded();

    if (isTodayCalculationComplete) {
      calculateSalary();
    } else {
      calculateSalary();
      intervalRef.current = setInterval(calculateSalary, 1000); 
    }

    return () => clearIntervalIfNeeded();
  }, [monthlySalary, workDaysPerMonth, workHoursPerDay, workStartTime, workEndTime, lunchBreakHours, isTodayCalculationComplete]);

  useEffect(() => {
    setAccumulatedDaily(monthlySalary / workDaysPerMonth)
  },[monthlySalary,workDaysPerMonth,])

  return (
    <div className="max-w-4xl mx-auto">
      {/* 工具标题 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl text-3xl mb-4">
          💰
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          牛马粮食计算器
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          实时计算工资收入，让你知道每分每秒都在赚钱
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：参数设置 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            工资参数设置
          </h2>

          <div className="space-y-4">
            {/* 隐私开关 */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div>
                <label className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  显示敏感信息
                </label>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  关闭后工资数据将被隐藏
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showSalary}
                  onChange={(e) => setShowSalary(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* 月薪 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                月薪 (元)
              </label>
              <input 
                type={showSalary ? 'number' : 'password'}
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入月薪"
              />
            </div>

            {/* 工作天数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                每月工作天数
              </label>
              <input 
                type="number" 
                value={workDaysPerMonth}
                onChange={(e) => setWorkDaysPerMonth(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="22"
              />
            </div>

            {/* 工作小时 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                每日名义工作小时
              </label>
              <input 
                type="number" 
                value={workHoursPerDay}
                onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="8"
              />
            </div>

            {/* 上班时间 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  上班时间
                </label>
                <input 
                  type="time" 
                  value={workStartTime}
                  onChange={(e) => setWorkStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  下班时间
                </label>
                <input 
                  type="time" 
                  value={workEndTime}
                  onChange={(e) => setWorkEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 午休时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                午休小时数
              </label>
              <input 
                type="number" 
                value={lunchBreakHours}
                min="0"
                step="0.5"
                onChange={(e) => setLunchBreakHours(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1"
              />
            </div>
          </div>
        </div>

        {/* 右侧：收入统计 */}
        <div className="space-y-6">
          {/* 日薪统计 */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">日薪收入</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {showSalary ? `¥${accumulatedDaily.toFixed(2)}` : '¥***'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              每天的固定收入
            </p>
          </div>

          {/* 累计收入 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">本月累计</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {showSalary ? `¥${accumulatedSalary.toFixed(2)}` : '¥***'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              截至目前已赚取的金额
            </p>
          </div>

          {/* 剩余时间 */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">今日剩余</h3>
            </div>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {remainingTimeToday}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              完成今日KPI还需要的时间
            </p>
          </div>

          {/* 状态提示 */}
          {isTodayCalculationComplete && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    今日任务完成！
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    计时器已停止，修改参数可重新计算
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          使用说明
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>填入你的月薪和工作参数，系统会实时计算收入</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>午休时间会从工作时间中扣除</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>所有数据保存在本地，不会上传到服务器</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>可以关闭敏感信息显示保护隐私</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;