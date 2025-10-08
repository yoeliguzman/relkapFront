import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../../services/api.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  data: ApiResponse | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    const result = localStorage.getItem('analysisResult');
    if (result) {
      this.data = JSON.parse(result);
    } else {
      // Si no hay datos, volver a upload
      this.router.navigate(['/upload']);
    }
  }

  goBack() {
    localStorage.removeItem('analysisResult');
    this.router.navigate(['/upload']);
  }

  getKeywords(): string[] {
    if (!this.data) return [];
    return this.data.keywords.map(item => item[0]);
  }
}
