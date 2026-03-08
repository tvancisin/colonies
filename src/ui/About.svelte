<div id="people">
  <h3 style="position: absolute; left: 10px; top: 0px">About</h3>
  <div id="about">
    <div class="content">
      <p>
        This work uses the historical student records of the University of St
        Andrews to demonstrate how an exploration of the student community can
        contribute to our understanding of the ways UK universities have been
        implicated in British colonial/imperial activities. It also contributes
        to the investigation of student origins, international student mobility
        and alumni career patterns. Using digital technology, we identified 901
        individuals who came from or later lived or worked in the colonies and
        who studied at (or were accredited by) St Andrews between 1700 and 1897.
        Furthermore, we developed a custom-built, web-based and interactive
        visualisation to better understand the chronological, geographical and
        career trends within the records. This allowed us to explore trends in
        finer detail than traditional tabular statistics and it was crucial in
        directing our attention to particular groups of people. We close with
        reflections on the challenges involved in using information
        visualisation on incomplete historical records. Full paper: <a
          href="https://www.tandfonline.com/doi/full/10.1080/0046760X.2026.2631124"
          target="_blank"
          style="color: white;">History of Education</a
        >
      </p>
      <figure class="image-container">
        <img
          src="./colonies_black.png"
          alt="Report Image"
          class="float-image"
        />
        <figcaption class="image-caption">
          UK universities studying their colonial past. White font indicates
          published reports [as of March 2026].
        </figcaption>
      </figure>
      <p>
        Unlike other universities in the UK, we looked at <strong
          >all our colonial connections</strong
        > including North America, Caribbean, Indian subcontinent, Australasia, South
        & East Asia and Africa. In addition, we explored not only the financial,
        but also social, cultural, and intellectual links between our students/alumni
        and the colonies. Lastly, we used interactive visual interfaces as a means
        to explore/look at our data from new perspectives and present it in an engaging
        way.
      </p>
    </div>
  </div>
</div>

<style>
  #people {
    position: relative;
    background-color: #242429;
    width: 100%;
  }

  h3 {
    color: white;
    font-weight: 700;
  }

  #about {
    position: relative;
    padding: 20px;
    padding-top: 30px;
    padding-bottom: 50px;
    width: 50%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .content {
    color: white;
    line-height: 1.5;
  }

  .image-container {
    margin: 50px auto;
    text-align: center;
  }

  .float-image {
    width: 100%;
    display: block;
    border-radius: 2px;
  }

  .image-caption {
    font-size: 14px;
    font-weight: 700;
    color: steelblue;
    margin-top: 8px;
    font-style: italic;
  }

  @media (max-width: 768px) {
    #about {
      width: 90%;
    }
  }

  @media (max-width: 768px) {
    .float-image {
      width: 100%;
    }
  }

  p {
    text-indent: 20px;
    font-size: 16px;
    font-weight: 500;
  }
</style>
