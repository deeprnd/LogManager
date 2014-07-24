NodeJS log manager
==============

NodeJS log manager with some useful features and Loggly integration
--------------

**Main Features:**
- Request id persistence
- operation delta
- Loggly integration
- File output integration

**Request separation:**

Each time you receive a request a new id is generated, allowing you to follow all your logs from the same request easily

See example of 2 requests and notice the 'd' parameter.

info:  d=2ecd1b47-c300-47a5-b3c4-19d6775e3510, t=09:25:39.623, i=inside the get
info:  d=2ecd1b47-c300-47a5-b3c4-19d6775e3510, t=09:25:39.630, i=another log
info:  d=a0e4dc77-3a2e-44ac-acaa-12635e6662fb, t=09:25:44.839, i=inside the get
info:  d=a0e4dc77-3a2e-44ac-acaa-12635e6662fb, t=09:25:44.840, i=another log

Any contribute and feature requests are welcome