const mongoose = require("mongoose");
const { Track } = require("../../models/track");

const getAllTimeLogs = async (userId, timezone) => {
  const timeLogs = await Track.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        time: 1,
      },
    },
    {
      $project: {
        date: "$date",
        hour: {
          $hour: {
            date: "$time",
            timezone: timezone,
          },
        },
        minute: {
          $minute: {
            date: "$time",
            timezone: timezone,
          },
        },
        dayOfWeek: {
          $dayOfWeek: {
            date: "$time",
            timezone: timezone,
          },
        },
        time: "$time",
        organization: "$organization",
        defaultSchedule: "$defaultSchedule",
        move: "$move",
        extra: "$extra",
      },
    },
    {
      $group: {
        _id: "$date",
        organization: { $first: "$organization" },
        dayOfWeek: { $first: "$dayOfWeek" },
        defaultSchedule: { $first: "$defaultSchedule" },
        extra: { $first: "$extra" },
        doorLogs: {
          $push: {
            hour: "$hour",
            minute: "$minute",
            time: "$time",
            move: "$move",
          },
        },
      },
    },
  ]);

  const convertMinToHour = (min) => min / 60;
  return timeLogs.map((timeLog) => {
    const doorLogs = timeLog.doorLogs;
    const { _id, ...timeLogObj } = timeLog;
    const lastIndex = doorLogs.length - 1;
    const [totalHour, extraHour] = doorLogs.reduce(
      ([totalHour, _extraHour, prevDoorLog], doorLog, index) => {
        let hour = 0;
        let extraEveningHourDone = 0;
        let extraMorningHourDone = 0;
        const { hour: curHour, minute: curMin } = doorLog;
        const curTimeInMinutes = curHour * 60 + curMin;

        if (index === 0) {
          const jobStartTimeInMinutes =
            timeLog.defaultSchedule.startTime.hour * 60 +
            timeLog.defaultSchedule.startTime.minute;
          const extraMorningMinuteDone =
            jobStartTimeInMinutes - curTimeInMinutes;
          extraMorningHourDone = convertMinToHour(extraMorningMinuteDone);
          if (extraMorningMinuteDone < 15 || !timeLog.extra.earlyWork.done) {
            hour -= extraMorningHourDone;
            extraMorningHourDone = 0;
          }
        }
        if (doorLog.move === "OUT") {
          const { hour: prevHour, minute: prevMin } = prevDoorLog;
          const prevTimeInMinutes = prevHour * 60 + prevMin;
          const usedUnpaidBreakHour = timeLog.defaultSchedule.breakTimes
            .filter((breakTime) => !breakTime.paid)
            .reduce((usedUnpaidBreakHour, { breakTime, durationInMin }) => {
              const startingBreakTimeMinutes =
                breakTime.hour * 60 + breakTime.minute;
              const endingBreakTimeMinutes =
                startingBreakTimeMinutes + durationInMin;

              if (
                (prevTimeInMinutes < startingBreakTimeMinutes &&
                  curTimeInMinutes < startingBreakTimeMinutes) ||
                (prevTimeInMinutes > startingBreakTimeMinutes &&
                  prevTimeInMinutes > endingBreakTimeMinutes)
              ) {
                return usedUnpaidBreakHour;
              } else if (
                prevTimeInMinutes <= startingBreakTimeMinutes &&
                curTimeInMinutes <= endingBreakTimeMinutes
              ) {
                return (
                  usedUnpaidBreakHour +
                  convertMinToHour(curTimeInMinutes - startingBreakTimeMinutes)
                );
              } else if (
                prevTimeInMinutes <= startingBreakTimeMinutes &&
                curTimeInMinutes >= endingBreakTimeMinutes
              ) {
                return usedUnpaidBreakHour + convertMinToHour(durationInMin);
              } else if (
                prevTimeInMinutes >= startingBreakTimeMinutes &&
                prevTimeInMinutes <= endingBreakTimeMinutes
              ) {
                // Includes Break Time so
                return (
                  usedUnpaidBreakHour +
                  convertMinToHour(
                    curTimeInMinutes < endingBreakTimeMinutes
                      ? curTimeInMinutes - prevTimeInMinutes
                      : endingBreakTimeMinutes - prevTimeInMinutes
                  )
                );
              }
              return usedUnpaidBreakHour;
            }, 0);
          hour =
            convertMinToHour(curTimeInMinutes - prevTimeInMinutes) -
            usedUnpaidBreakHour;
          const jobEndTimeInMinutes =
            timeLog.defaultSchedule.endTime.hour * 60 +
            timeLog.defaultSchedule.endTime.minute;
          if (index === lastIndex) {
            const extraEveningMinuteDone =
              curTimeInMinutes - jobEndTimeInMinutes;
            extraEveningHourDone = convertMinToHour(extraEveningMinuteDone);
            if (extraEveningMinuteDone < 15) {
              hour -= extraEveningHourDone;
              extraEveningHourDone = 0;
            }
          }
        }

        return [
          totalHour + hour,
          {
            morningHour: extraMorningHourDone,
            eveningHour: extraEveningHourDone,
          },
          doorLog,
        ];
      },
      [0, null, null]
    );

    return { date: _id, ...timeLogObj, totalHour: totalHour, extraHour };
  });
};

module.exports = {
  getAllTimeLogs,
};
