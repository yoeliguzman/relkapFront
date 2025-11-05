import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../../services/api.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  data: ApiResponse | null = null;

  // Chart.js datasets
  public barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };

  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top', labels: { color: '#e2e8f0' } } },
    scales: {
      x: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } },
      y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } }
    }
  };

  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom', labels: { color: '#e2e8f0' } } }
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Tiempo (s)', color: '#cbd5e1' }, ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
      y: { min: 0, max: 1, title: { display: true, text: 'Confianza', color: '#cbd5e1' }, ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } }
    }
  };

  constructor(private router: Router) { }

  ngOnInit() {
    const result = localStorage.getItem('analysisResult');
    if (result) {
      this.data = JSON.parse(result);
      this.prepareCharts();
    } else {
      this.router.navigate(['/upload']);
    }
  }

  goBack() {
    localStorage.removeItem('analysisResult');
    this.router.navigate(['/upload']);
  }

  private prepareCharts() {
    if (!this.data) return;

    const topKeywords = this.data.keywords.slice(0, 8);
    this.barChartData = {
      labels: topKeywords.map(k => k[0]),
      datasets: [{
        label: 'Frecuencia',
        data: topKeywords.map(k => k[1]),
        backgroundColor: [
          '#3b82f6', '#0ea5e9', '#14b8a6', '#10b981',
          '#84cc16', '#facc15', '#f97316', '#ef4444'
        ],
        borderRadius: 6
      }]
    };

    const sentimentLabel = this.capitalize(this.data.sentimiento.label);
    this.pieChartData = {
      labels: ['Positivo', 'Negativo', 'Neutro'],
      datasets: [{
        data: [
          this.data.sentimiento.label.toLowerCase() === 'positivo' ? 100 : 0,
          this.data.sentimiento.label.toLowerCase() === 'negativo' ? 100 : 0,
          this.data.sentimiento.label.toLowerCase() === 'neutro' ? 100 : 0
        ],
        backgroundColor: ['#10b981', '#ef4444', '#6b7280'],
        hoverOffset: 8
      }]
    };

    if (this.data.timeline_sentimientos) {
      this.lineChartData = {
        labels: this.data.timeline_sentimientos.map(t => `${t.end.toFixed(0)}s`),
        datasets: [{
          data: this.data.timeline_sentimientos.map(t => t.score),
          label: 'Confianza',
          fill: false,
          borderColor: this.getSentimentColor(this.data.sentimiento.label),
          pointBackgroundColor: '#f1f5f9',
          tension: 0.3
        }]
      };
    }
  }

  private getSentimentColor(label: string): string {
    switch (label.toLowerCase()) {
      case 'positivo': return '#10b981';
      case 'negativo': return '#ef4444';
      case 'neutro': return '#6b7280';
      default: return '#3b82f6';
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
