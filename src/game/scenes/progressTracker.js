export class ProgressTracker extends Scene {
  constructor() {
    super({key: "ProgressTracker"});
    this.progressData = {
      score: 0
    }
  }

  updateScore(score) {
    this.progressData.score += score;
  }

  resetProgress() {
    this.progressData = {
      score: 0
    }
  }


}