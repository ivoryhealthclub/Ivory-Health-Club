---
name: Program enrollment storage
description: Durable convention for recording program enrollment requests in the Ivory Health Club app.
---

Program enrollment requests should continue to use the existing booking flow rather than introduce a parallel enrollment model. Store the selected program, participant or company details, age, experience option, and goals in the booking's request notes while keeping the appropriate fitness or youth service type.

**Why:** The booking API already provides persistence and a pending-review workflow, so program enrollment can be implemented without a schema migration or a second admin queue.

**How to apply:** New program enrollment UI should submit through the existing booking mutation and include a human-readable program label plus all program-specific fields in the request notes.