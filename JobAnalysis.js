    document.getElementById("file-input").addEventListener("change", handleFileUpload)
    document.querySelector("button").addEventListener("click", applyFilters);

    let jobs = [];
    let filteredJobs = [];

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    jobs = data.map(job => new Job(
                        job["Title"],
                        job["Posted"],
                        job["Type"], 
                        job["Level"], 
                        job["Skill"], 
                        job["Detail"]
                    ));
                    populateFilters(jobs);
                    applyFilters();
                } catch (error) {
                    alert("Error loading JSON file. Please ensure the format is correct.");
                }
            };
            reader.readAsText(file);
        }
    }

    function sortJobs() {
        const sortOption = document.getElementById("sort-select").value;

        switch (sortOption) {
            case "az":
                filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "za":
                filteredJobs.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case "newest":
                filteredJobs.sort((a, b) => a.getFormattedPostedTime() - b.getFormattedPostedTime());
                break;
            case "oldest":
                filteredJobs.sort((a, b) => b.getFormattedPostedTime() - a.getFormattedPostedTime());
                break;
        }

        displayJobs(filteredJobs);
    }

    function populateFilters(jobs) {
        const levels = new Set(jobs.map(job => job.level));
        const types = new Set(jobs.map(job => job.type));
        const skills = new Set(jobs.map(job => job.skill));

        populateSelect("level-select", levels);
        populateSelect("type-select", types);
        populateSelect("skill-select", skills);
    }

    function populateSelect(selectId, options) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = '<option value="">Any</option>';
        options.forEach(option => {
            if (option) {
                const optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
            }
        });
    }

    function displayJobs(jobs) {
        const jobList = document.getElementById("job-list");
        const jobHead = document.getElementById("jobHead")
        
        jobHead.innerHTML = "Available Jobs:"
        jobList.innerHTML = "";

        if (jobs.length === 0) {
            jobList.innerHTML = "<p>No jobs found matching the criteria.</p>";
            return;
        }

        jobs.forEach(job => {
            const jobElement = document.createElement("div");
            jobElement.className = "job";
            jobElement.textContent = `${job.title} - ${job.level}`;
            jobElement.addEventListener("click", () => showJobDetails(job));
            jobList.appendChild(jobElement);
        });
    }

    function applyFilters() {
        const selectedLevel = document.getElementById("level-select").value;
        const selectedType = document.getElementById("type-select").value;
        const selectedSkill = document.getElementById("skill-select").value;

        filteredJobs = jobs.filter(job => {
            const levelMatch = !selectedLevel || job.level === selectedLevel;
            const typeMatch = !selectedType || job.type === selectedType;
            const skillMatch = !selectedSkill || job.skill === selectedSkill;
            return levelMatch && typeMatch && skillMatch;
        });

        displayJobs(filteredJobs);
    }

    class Job{
        constructor(title, posted, type, level, skill, details){
            this.title = title;
            this.posted = posted;
            this.type = type;
            this.level = level;
            this.skill = skill;
            this.details = details;
        }

        getDetails() {
            return `<h2>Full Job Details</h2>
            <strong>Title:</strong> ${this.title}<br>
            <strong>Type:</strong> ${this.type}<br>
            <strong>Level:</strong> ${this.level}<br>
            <strong>Skill:</strong> ${this.skill}<br>
            <strong>Details:</strong> ${this.details}<br><br>
            <strong>Posted:</strong> ${this.posted}`;
        }

        getFormattedPostedTime(){
            const [value, unit] = this.posted.split(" ");
            const numericValue = parseInt(value, 10);
            return unit.startsWith("hour") ? numericValue * 60 : numericValue;
        }
    }

    const jobDetailModal = document.getElementById("job-detail-modal");
    const modalDetails = document.getElementById("modal-details");
    const modalClose = document.getElementById("modal-close");

    function showJobDetails(job) {
        console.log("Job clicked:", job);
        modalDetails.innerHTML = job.getDetails();
        jobDetailModal.style.display = "flex";
    }

    modalClose.addEventListener("click", () => {
        jobDetailModal.style.display = "none";
    });

    jobDetailModal.addEventListener("click", (event) => {
        if (event.target === jobDetailModal) {
            jobDetailModal.style.display = "none";
        }
    });
