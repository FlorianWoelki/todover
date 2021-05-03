<template>
  <div class="absolute z-50 p-4 mt-2 bg-white rounded-lg shadow" style="width: 17rem">
    <div class="flex items-center justify-between mb-2">
      <div>
        <span class="text-lg font-bold text-gray-800">{{ monthNames[month] }}</span>
        <span class="ml-1 text-lg font-normal text-gray-600">{{ year }}</span>
      </div>
      <div>
        <button
          type="button"
          class="inline-flex p-1 transition duration-100 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline hover:bg-gray-100"
          @click.stop="handleBackClick"
        >
          <svg
            class="inline-flex w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex p-1 transition duration-100 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline hover:bg-gray-100"
          @click.stop="handleForwardClick"
        >
          <svg
            class="inline-flex w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex flex-wrap mb-3 -mx-1">
      <template v-for="(day, index) in days" :key="index">
        <div style="width: 14.26%" class="px-0.5">
          <div class="text-xs font-medium text-center text-gray-800">{{ day }}</div>
        </div>
      </template>
    </div>

    <div class="flex flex-wrap -mx-1">
      <div
        v-for="blankday in blankdays"
        :key="blankday"
        style="width: 14.28%"
        class="p-1 text-sm text-center border border-transparent"
      ></div>
      <div
        v-for="(date, dateIndex) in noOfDays"
        :key="dateIndex"
        style="width: 14.28%"
        class="px-1 mb-1"
      >
        <div
          @click="getDateValue(date)"
          class="text-sm leading-none leading-loose text-center transition duration-100 ease-in-out rounded-full cursor-pointer"
          :class="{
            'bg-red-200': isToday(date) == true,
            'text-gray-600 hover:bg-red-200':
              isToday(date) == false && isSelectedDate(date) == false,
            'bg-red-500 text-white hover:bg-opacity-75': isSelectedDate(date) == true,
          }"
        >
          {{ date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/runtime-core';

export default defineComponent({
  emits: ['select-date'],
  setup(_, { emit }) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthShortNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const datepickerValue = ref('');
    const month = ref(0);
    const year = ref(0);
    const blankdays = ref<number[]>([]);
    const noOfDays = ref<any[]>([]);

    onMounted((): void => {
      const today = new Date();
      month.value = today.getMonth();
      year.value = today.getFullYear();
      datepickerValue.value = formatDateForDisplay(today);

      getNoOfDays();
    });

    const handleBackClick = (): void => {
      if (month.value === 0) {
        year.value--;
        month.value = 12;
      }

      month.value--;
      getNoOfDays();
    };

    const handleForwardClick = (): void => {
      if (month.value === 11) {
        month.value = 0;
        year.value++;
      } else {
        month.value++;
      }

      getNoOfDays();
    };

    const getNoOfDays = (): void => {
      const daysInMonth = new Date(year.value, month.value + 1, 0).getDate();
      // find where to start calendar day of week
      const dayOfWeek = new Date(year.value, month.value).getDay();
      const blankdaysArray: number[] = [];
      for (var i = 1; i <= dayOfWeek; i++) {
        blankdaysArray.push(i);
      }

      const daysArray: number[] = [];
      for (var i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
      }

      blankdays.value = blankdaysArray;
      noOfDays.value = daysArray;
    };

    const getDateValue = (date: number): void => {
      const selectedDate = new Date(year.value, month.value, date);
      datepickerValue.value = formatDateForDisplay(selectedDate);
      isSelectedDate(date);
      emit('select-date', datepickerValue.value);
    };

    const isToday = (date: number) => {
      const today = new Date();
      const d = new Date(year.value, month.value, date);
      return today.toDateString() === d.toDateString() ? true : false;
    };

    const isSelectedDate = (date: number) => {
      const d = new Date(year.value, month.value, date);
      return datepickerValue.value === formatDateForDisplay(d) ? true : false;
    };

    const formatDateForDisplay = (date: Date) => {
      const formattedDate = ('0' + date.getDate()).slice(-2); // appends 0 (zero) in single digit date
      const formattedMonthInNumber = ('0' + (date.getMonth() + 1)).slice(-2);
      const formattedYear = date.getFullYear();
      return `${formattedYear}-${formattedMonthInNumber}-${formattedDate}`;
    };

    return {
      datepickerValue,
      getDateValue,
      isToday,
      isSelectedDate,
      blankdays,
      noOfDays,
      handleForwardClick,
      handleBackClick,
      month,
      year,
      monthNames,
      monthShortNames,
      days,
    };
  },
});
</script>
