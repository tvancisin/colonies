<div id="provenance" class="timeline-container">
    <h3 style="position: absolute; left: 10px; top: 0px">Provenance</h3>
    <!-- Vertical Timeline Line -->
    <div class="timeline"></div>

    <!-- Events -->
    <div class="timeline-event" style="margin-bottom: 1000px">
        <div class="event-content">
            <div class="event-image">
                <img src="./orig.jpg" alt="1579 Event" />
            </div>
            <div class="event-text" style="padding-left: 10px">
                <h3>1579</h3>
                <p>Matriculation Roll</p>
            </div>
        </div>
    </div>

    <div class="timeline-event" style="margin-bottom: 20px">
        <div class="event-content">
            <div
                class="event-text"
                style="text-align: right; margin-right: 10px"
            >
                <h3>1905</h3>
                <p>Manual transcription of 1747-1897 records</p>
            </div>
            <div class="event-image">
                <img src="ander.jpg" alt="1888 Event" />
            </div>
        </div>
    </div>

    <div class="timeline-event" style="margin-bottom: 300px">
        <div class="event-content">
            <div class="event-image">
                <img src="ander_2.jpg" alt="1888 Event" />
            </div>
            <div class="event-text" style="padding-left: 10px">
                <h3>1927</h3>
                <p>Manual transcription of 1579-1746 records</p>
            </div>
        </div>
    </div>

    <div class="timeline-event" style="margin-bottom: 50px">
        <div class="event-content">
            <div
                class="event-text"
                style="text-align: right; margin-right: 10px"
            >
                <h3>2004</h3>
                <p>Expansion of 1747-1897 records</p>
            </div>
            <div class="event-image">
                <img src="smart.png" alt="1888 Event" />
            </div>
        </div>
    </div>

    <div class="timeline-event" style="margin-bottom: 10px">
        <div class="event-content">
            <div class="event-image">
                <img src="smart_2.png" alt="1888 Event" />
            </div>
            <div class="event-text" style="padding-left: 10px">
                <h3>2012</h3>
                <p>Expansion of 1579-1746 records</p>
            </div>
        </div>
    </div>

    <div class="timeline-event">
        <div class="event-content">
            <div
                class="event-text"
                style="text-align: right; margin-right: 10px"
            >
                <h3>2016</h3>
                <p>Digitization of 1747-1897 records</p>
            </div>
            <div class="event-image">
                <img src="digital.png" alt="1888 Event" />
            </div>
        </div>
    </div>

    <div class="timeline-event">
        <div class="event-content">
            <div class="event-image">
                <img src="digital_2.png" alt="1888 Event" />
            </div>
            <div class="event-text" style="padding-left: 10px">
                <h3>2020</h3>
                <p>Digitization of 1579-1746 records</p>
            </div>
        </div>
    </div>
</div>

<style>
    h3 {
        color: white;
        font-weight: 400;
    }
    /* Parent container for all timeline events */
    .timeline-container {
        position: relative;
        width: 100%; /* Full screen width */
        display: flex;
        flex-direction: column; /* Stack events vertically */
        align-items: center; /* Center the events horizontally relative to the timeline */
        gap: 20px; /* Add vertical spacing between events */
        padding: 20px 0; /* Add padding to the top and bottom */
        padding-top: 100px;
        background-color: #001c23;
    }

    /* Timeline Line */
    .timeline {
        position: absolute;
        width: 1px;
        height: 95%;
        background-color: rgb(255, 0, 0);
        z-index: 1; /* Ensure it's below the events */
    }

    /* Timeline Events */
    .timeline-event {
        position: relative; /* Positioned within the flex container */
        width: 80%; /* Takes 80% of screen width */
        display: flex;
        justify-content: center;
        z-index: 2; /* Ensure it appears above the timeline */
    }

    .event-content {
        display: flex;
        width: 100%;
        overflow: hidden;
    }

    .event-image {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden; /* Ensures enlarged images don't overflow the container */
    }

    .event-image img {
        width: 100%;
        border-radius: 3px;
    }

    /* Text Section */
    .event-text {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .event-text h3 {
        margin: 0 0 0px;
        font-size: 18px;
        color: #ffffff;
        padding-left: 0px;
    }

    .event-text p {
        margin: 0;
        font-size: 14px;
        color: #ffffff;
        padding-left: 0px;
    }

    /* Responsive Design */
    @media (max-width: 750px) {
        .timeline-container {
            gap: 1px; /* Increase gap between events on smaller screens */
        }

        .event-content {
            flex-direction: column; /* Stack image and text vertically */
            align-items: center;
        }

        .event-image,
        .event-text {
            flex: none;
            width: 100%;
        }

        .event-text {
            padding: 10px;
        }
    }
</style>
