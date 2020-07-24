<template>
  <div>
    <h2 class='text-center'>Graph in D3</h2>
    <svg id='graph'></svg>
    <h2>{{elem}}</h2>
    <h3>{{results}}</h3>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Graph',
  props: ['elem', 'results'],
  data () {
    return {
      graph: {},
      height: 500,
      width: 500
      // width: this.graphSize()
    }
  },
  mounted () {
    this.fetchData()
      .then(result => this.drawGraph())
      // .catch(error => console.log(error))
  },
  methods: {
    async fetchData () {
      this.graph = await d3.json('./miserables.json')
      return this.graph
    },
    drawGraph () {
      const nodes = this.graph.nodes.map(d => Object.create(d))
      const links = this.graph.links.map(d => Object.create(d))

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))

      const svg = d3.select('#graph')
        .attr('height', this.height)
        .attr('width', this.width)

      const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value))

      const node = svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 5)
        .attr('fill', d => this.color(d))
        .call(this.drag(simulation))

      node.append('title')
        .text(d => d.id)

      simulation.on('tick', () => {
        link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)
        node.attr('cx', d => d.x)
          .attr('cy', d => d.y)
      })

      // invalidation.then(() => simulation.stop())
      return svg.node()
    },
    drag (simulation) {
      function dragstarted (d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }
      function dragged (d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }
      function dragended (d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    },
    color (d) {
      // const scale = d3.scaleOrdinal(d3.schemeCategory10)
      // console.log(d.group)
      // console.log(scale(d.group))
      // return scale(d.group)

      // console.log(d3.schemeCategory10[d.group])
      return d3.schemeCategory10[d.group]
    }
  }
  // computed: {
  //   graphSize: function () {
  //     var width = 1000 // default
  //     switch (this.$vuetify.breakpoint.name) {
  //       case 'xs':
  //         width = 200
  //         break
  //       case 'sm':
  //         width = 400
  //         break
  //       case 'md':
  //         width = 800
  //         break
  //       case 'lg':
  //         width = 1000
  //         break
  //       case 'xl':
  //         width = 1200
  //         break
  //     }
  //     console.log(width)
  //     return width
  //   }
  // }
}
</script>
