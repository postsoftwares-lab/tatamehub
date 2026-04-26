<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Chart } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend)

interface ChartDataItem {
  month: string
  amount: number
}

interface Props {
  data: ChartDataItem[]
}

const props = defineProps<Props>()

const chartRef = ref<InstanceType<typeof Chart> | null>(null)

const chartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Receita',
      data: [] as number[],
      backgroundColor: 'rgb(59, 130, 246)',
      borderColor: 'rgb(59, 130, 246)',
      borderRadius: 6,
      borderSkipped: false,
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'x' as const,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          size: 12
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    x: {
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          size: 12
        }
      },
      grid: {
        display: false
      }
    }
  }
}

watch(
  () => props.data,
  (newData) => {
    if (newData && newData.length > 0) {
      chartData.value = {
        labels: newData.map(d => d.month),
        datasets: [
          {
            label: 'Receita',
            data: newData.map(d => d.amount),
            backgroundColor: 'rgb(59, 130, 246)',
            borderColor: 'rgb(59, 130, 246)',
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      }
    }
  },
  { deep: true }
)

onMounted(() => {
  if (props.data && props.data.length > 0) {
    chartData.value = {
      labels: props.data.map(d => d.month),
      datasets: [
        {
          label: 'Receita',
          data: props.data.map(d => d.amount),
          backgroundColor: 'rgb(59, 130, 246)',
          borderColor: 'rgb(59, 130, 246)',
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    }
  }
})
</script>

<template>
  <div class="w-full h-96">
    <Chart
      ref="chartRef"
      type="bar"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>
